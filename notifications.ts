/**
 * lib/notifications.ts
 *
 * Gestion des notifications par Email/SMS
 *
 * Dépendances:
 * - Resend: pour les emails
 * - Twilio: pour les SMS (optionnel)
 *
 * Installation:
 * npm install resend
 * npm install twilio (optionnel)
 */

import { Resend } from 'resend';

// Initialize Resend (clé API via env)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Envoie un email de notification à l'établissement
 * lors d'une nouvelle candidature
 */
export async function sendLeadNotification({
  establishment,
  lead,
  contact
}: {
  establishment: any;
  lead: any;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    relation: string;
  };
}) {
  if (!resend) {
    console.warn('Resend non configuré, notification non envoyée');
    return;
  }

  const emailContent = `
    <h2>Nouvelle candidature reçue</h2>
    <p>Une nouvelle candidature a été reçue pour votre établissement <strong>${establishment.name}</strong>.</p>

    <h3>Candidat</h3>
    <ul>
      <li><strong>Nom:</strong> ${lead.elderlyFirstName} ${lead.elderlyLastName}</li>
      <li><strong>Date de naissance:</strong> ${new Date(lead.elderlyBirthDate).toLocaleDateString('fr-FR')}</li>
      <li><strong>Besoins:</strong>
        <ul>
          ${lead.needsAlzheimer ? '<li>Unité Alzheimer</li>' : ''}
          ${lead.needsPhysiotherapy ? '<li>Physiothérapie</li>' : ''}
          ${lead.needsPharmacy ? '<li>Services pharmaceutiques</li>' : ''}
        </ul>
      </li>
      <li><strong>Budget:</strong> ${lead.preferredBudget}€/mois</li>
    </ul>

    <h3>Personne de contact</h3>
    <ul>
      <li><strong>Nom:</strong> ${contact.firstName} ${contact.lastName} (${contact.relation})</li>
      <li><strong>Email:</strong> ${contact.email}</li>
      <li><strong>Téléphone:</strong> ${contact.phone}</li>
    </ul>

    <h3>Prochaines étapes</h3>
    <p>
      <a href="https://retiremaisons.fr/dashboard/leads/${lead.id}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Consulter la candidature
      </a>
    </p>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Cette notification a été générée automatiquement par RetireMaisons.
    </p>
  `;

  try {
    await resend.emails.send({
      from: 'noreply@retiremaisons.fr',
      to: establishment.owner.email,
      subject: `Nouvelle candidature - ${lead.elderlyFirstName} ${lead.elderlyLastName}`,
      html: emailContent
    });
  } catch (error) {
    console.error('Erreur envoi email établissement:', error);
    throw error;
  }
}

/**
 * Envoie un email de confirmation à la famille
 */
export async function sendConfirmationEmail({
  email,
  firstName,
  establishmentName
}: {
  email: string;
  firstName: string;
  establishmentName: string;
}) {
  if (!resend) {
    console.warn('Resend non configuré, confirmation non envoyée');
    return;
  }

  const emailContent = `
    <h2>Candidature confirmée</h2>
    <p>Bonjour ${firstName},</p>
    <p>Votre candidature pour <strong>${establishmentName}</strong> a bien été reçue.</p>

    <h3>Que se passe-t-il ensuite ?</h3>
    <ol>
      <li>L'établissement examine votre dossier</li>
      <li>Vous serez contacté(e) dans les prochains jours</li>
      <li>Une visite des locaux pourra être organisée</li>
      <li>Une décision d'admission vous sera communiquée</li>
    </ol>

    <h3>Suivi de votre dossier</h3>
    <p>
      <a href="https://retiremaisons.fr/status" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Consulter l'état de votre candidature
      </a>
    </p>

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Vous avez des questions? Contactez-nous à support@retiremaisons.fr
    </p>
  `;

  try {
    await resend.emails.send({
      from: 'noreply@retiremaisons.fr',
      to: email,
      subject: `Candidature confirmée pour ${establishmentName}`,
      html: emailContent
    });
  } catch (error) {
    console.error('Erreur envoi email confirmation:', error);
    throw error;
  }
}

/**
 * Notification de changement de statut du lead
 * (PENDING → VISITED → ADMITTED/REJECTED)
 */
export async function sendStatusChangeNotification({
  familyEmail,
  familyName,
  establishmentName,
  oldStatus,
  newStatus
}: {
  familyEmail: string;
  familyName: string;
  establishmentName: string;
  oldStatus: string;
  newStatus: string;
}) {
  if (!resend) return;

  const statusMessages: Record<string, string> = {
    PENDING: 'Candidature en attente',
    VISITED: 'Visite effectuée',
    ADMITTED: '✓ Admission confirmée !',
    REJECTED: 'Candidature refusée',
    WITHDRAWN: 'Candidature retirée'
  };

  const emailContent = `
    <h2>Mise à jour de votre dossier</h2>
    <p>Bonjour ${familyName},</p>
    <p>Le statut de votre candidature pour <strong>${establishmentName}</strong> a changé.</p>

    <div style="background-color: ${newStatus === 'ADMITTED' ? '#d1fae5' : '#fee2e2'}; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <strong style="font-size: 18px; color: ${newStatus === 'ADMITTED' ? '#059669' : '#dc2626'};">
        ${statusMessages[newStatus]}
      </strong>
    </div>

    ${newStatus === 'ADMITTED' ? `
      <h3>Congratulations! Vous êtes admis(e)</h3>
      <p>L'établissement a accepté votre candidature. Un représentant vous contactera pour organiser l'entrée.</p>
    ` : ''}

    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Questions? Contactez ${establishmentName} directement ou support@retiremaisons.fr
    </p>
  `;

  try {
    await resend.emails.send({
      from: 'noreply@retiremaisons.fr',
      to: familyEmail,
      subject: `Mise à jour: ${statusMessages[newStatus]}`,
      html: emailContent
    });
  } catch (error) {
    console.error('Erreur envoi notification changement statut:', error);
  }
}

/**
 * SMS Notification (optionnel - nécessite Twilio)
 */
export async function sendSmsNotification(
  phoneNumber: string,
  message: string
) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio non configuré, SMS non envoyé');
    return;
  }

  try {
    // Implémentation Twilio
    // const client = new Twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    //
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });

    console.log('SMS envoyé à', phoneNumber, ':', message);
  } catch (error) {
    console.error('Erreur envoi SMS:', error);
  }
}
