/**
 * app/api/leads/route.ts
 *
 * API ENDPOINT: POST /api/leads
 *
 * Crée un Lead (candidature) et déclenche:
 * 1. Enregistrement en DB (Prisma)
 * 2. Email de notification à l'établissement
 * 3. Email de confirmation à la famille
 *
 * Body requis:
 * {
 *   establishmentId: string,
 *   elderlyFirstName: string,
 *   elderlyLastName: string,
 *   elderlyBirthDate: string,
 *   needsAlzheimer: boolean,
 *   needsPhysiotherapy: boolean,
 *   needsPharmacy: boolean,
 *   preferredBudget: number,
 *   apaAmount: number,
 *   aplAmount: number,
 *   contactFirstName: string,
 *   contactLastName: string,
 *   contactEmail: string,
 *   contactPhone: string,
 *   contactRelation: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendLeadNotification, sendConfirmationEmail } from '@/lib/notifications';
import { z } from 'zod';

// Validation du body
const CreateLeadSchema = z.object({
  establishmentId: z.string().cuid(),
  elderlyFirstName: z.string().min(2),
  elderlyLastName: z.string().min(2),
  elderlyBirthDate: z.string().datetime(),
  elderlyPhone: z.string().optional(),
  needsAlzheimer: z.boolean().default(false),
  needsPhysiotherapy: z.boolean().default(false),
  needsPharmacy: z.boolean().default(false),
  preferredBudget: z.number().positive(),
  apaAmount: z.number().default(0),
  aplAmount: z.number().default(0),
  contactFirstName: z.string().min(2),
  contactLastName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  contactRelation: z.string()
});

export async function POST(request: NextRequest) {
  try {
    // Parse et valide le body
    const body = await request.json();
    const validatedData = CreateLeadSchema.parse(body);

    // Vérifier que l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: validatedData.establishmentId },
      include: { owner: true }
    });

    if (!establishment) {
      return NextResponse.json(
        { error: 'Établissement non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer ou créer l'utilisateur (famille)
    // NOTE: En production, on aurait une session utilisateur
    // Pour ce demo, on crée/récupère par email
    let user = await prisma.user.findUnique({
      where: { email: validatedData.contactEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validatedData.contactEmail,
          password: '', // À gérer avec auth provider
          role: 'FAMILY',
          firstName: validatedData.contactFirstName,
          lastName: validatedData.contactLastName,
          phone: validatedData.contactPhone
        }
      });
    }

    // Créer le Lead (candidature)
    const lead = await prisma.lead.create({
      data: {
        userId: user.id,
        establishmentId: establishment.id,
        elderlyFirstName: validatedData.elderlyFirstName,
        elderlyLastName: validatedData.elderlyLastName,
        elderlyBirthDate: new Date(validatedData.elderlyBirthDate),
        elderlyPhone: validatedData.elderlyPhone,
        needsAlzheimer: validatedData.needsAlzheimer,
        needsPhysiotherapy: validatedData.needsPhysiotherapy,
        needsPharmacy: validatedData.needsPharmacy,
        preferredBudget: validatedData.preferredBudget,
        apaAmount: validatedData.apaAmount,
        aplAmount: validatedData.aplAmount,
        status: 'PENDING'
      }
    });

    // Envoyer notifications
    try {
      // Email à l'établissement
      await sendLeadNotification({
        establishment,
        lead,
        contact: {
          firstName: validatedData.contactFirstName,
          lastName: validatedData.contactLastName,
          email: validatedData.contactEmail,
          phone: validatedData.contactPhone,
          relation: validatedData.contactRelation
        }
      });

      // Email de confirmation à la famille
      await sendConfirmationEmail({
        email: validatedData.contactEmail,
        firstName: validatedData.contactFirstName,
        establishmentName: establishment.name
      });

      // Log de la notification envoyée
      await prisma.notification.create({
        data: {
          recipientEmail: establishment.owner.email,
          recipientPhone: establishment.owner.phone || '',
          type: 'NEW_LEAD',
          title: `Nouvelle candidature pour ${establishment.name}`,
          content: `${validatedData.elderlyFirstName} ${validatedData.elderlyLastName} a postulé pour votre établissement.`,
          leadId: lead.id,
          establishmentId: establishment.id
        }
      });
    } catch (notificationError) {
      console.error('Erreur envoi notification:', notificationError);
      // Ne pas bloquer la création du lead si les emails échouent
    }

    // Réponse succès
    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: 'Candidature envoyée avec succès',
        data: {
          id: lead.id,
          status: lead.status,
          createdAt: lead.createdAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur création lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du lead' },
      { status: 500 }
    );
  }
}

// GET: Récupérer les leads (pour dashboard établissement)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const establishmentId = searchParams.get('establishmentId');

    if (!establishmentId) {
      return NextResponse.json(
        { error: 'establishmentId requis' },
        { status: 400 }
      );
    }

    const leads = await prisma.lead.findMany({
      where: { establishmentId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Erreur récupération leads:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
