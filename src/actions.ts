import Firebase from '@/services/firebase';

export const composeNewParcel = async (webhookBody: any) => {
    const envelopeId = webhookBody.data.envelopeId;

    const senderWallet = webhookBody.data.envelopeSummary.recipients.signers[0].clientUserId;
    const textTabs = webhookBody.data.envelopeSummary.recipients.signers[0].tabs.textTabs;
    const numberTabs = webhookBody.data.envelopeSummary.recipients.signers[0].tabs.numberTabs;

    const emailAddressTabs =
        webhookBody.data.envelopeSummary.recipients.signers[0].tabs.emailAddressTabs;
    const fullNameTabs = webhookBody.data.envelopeSummary.recipients.signers[0].tabs.fullNameTabs;

    const parcel: Parcel = {
        id: textTabs[0].value,
        status: 'pending',

        envelopes: {
            parcelDelivery: envelopeId,
        },
        sender: {
            wallet: senderWallet,

            email: emailAddressTabs[0].value,
            name: fullNameTabs[0].value,
        },
        recipient: {
            isDelegated: false,
            isSigned: false,

            email: textTabs[2].value,
            name: textTabs[1].value,
            phone: numberTabs[5].value,
            address: textTabs[3].value,
        },

        timestamp: Date.now(),
    };

    const firebase = new Firebase(true);
    await firebase.updateParcel(parcel);
    await firebase.addParcelId(senderWallet, parcel.id, 'sent');
};

export const updateParcelAgreement = async (webhookBody: any) => {
    const textTabs = webhookBody.data.envelopeSummary.recipients.signers[0].tabs.textTabs;

    const side = webhookBody.data.envelopeSummary.emailSubject.includes(
        'Delivery Completion Agreement'
    )
        ? 'sender'
        : 'recipient';

    const firebase = new Firebase(true);
    await firebase.updateParcelField(
        `${textTabs[0].value}/${side}/deliveryCompletion`,
        webhookBody.data.envelopeId
    );
};
