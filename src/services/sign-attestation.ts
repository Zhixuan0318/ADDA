import { SignProtocolClient, SpMode, EvmChains, Schema, Attestation } from '@ethsign/sp-sdk';
import { JsonRpcProvider } from 'ethers';

import { opBNBTestnet } from 'viem/chains';

const provider = new JsonRpcProvider(process.env.INFURA_API, opBNBTestnet.id);

export async function signAttestation(parcel: Parcel): Promise<string> {
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.opBNBTestnet,
    });

    const data = {
        parcelDeliveryAgreement: parcel.envelopes.parcelDelivery,
        preDeliveryAgreement: parcel.envelopes.preDelivery,
        deliveryCompletionAgreement: parcel.sender.deliveryCompletion,
        acknowledgmentAgreement: parcel.recipient.deliveryCompletion,
        senderAddress: parcel.sender.wallet,
        recipientAddress: parcel.recipient.wallet,
        senderNullifierHash: parcel.sender.nullifierHash,
        recipientNullifierHash: parcel.recipient.nullifierHash,
        senderEvidenceCID: parcel.sender.evidence,
        recipientEvidenceCID: parcel.recipient.evidence,
        deliveryCreationTimestamp: parcel.timestamp,
    };

    const schemaId = process.env.NEXT_PUBLIC_SCHEMA_ID?.split('_')[3] as string;
    const result = await client.createAttestation({
        schemaId,
        data,
        indexingValue: parcel.id,
    });

    const txReceipt = await provider.waitForTransaction(result.txHash as any);
    if (txReceipt?.status != 1) throw new Error('Tx error');

    return result.attestationId;
}

export async function getSchema(id: string): Promise<Schema> {
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.opBNBTestnet,
    });

    return await client.getSchema(id);
}

export async function getAttestation(id: string): Promise<Attestation> {
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.opBNBTestnet,
    });

    return await client.getAttestation(id);
}
