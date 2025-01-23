/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    env: {
        NEXT_PUBLIC_APP_LINK: '',

        // World Coin
        NEXT_PUBLIC_APP_ID: '',

        // Dynamic Connection
        ENVIRONMENTAL_ID: '',

        // Docusign App
        API_ACCOUNT_ID: '',
        INTEGRATION_KEY: '',
        SECRET_KEY: '',

        // Docusign Forms
        PARCEL_DELIVERY_FORM_ID: '',
        PRE_DELIVERY_AGREEMENT_TEMPLATE_ID: '',
        CLICK_WRAP_ID: '',
        DELIVERY_COMPLETION_ID: '',
        DELIVERY_ACKNOWLEDGEMENT_ID: '',

        // Pinata
        PINATA_JWT:
            '',
        NEXT_PUBLIC_PINATA_ENDPOINT: '',

        // Attestation
        INFURA_API: '',
        NEXT_PUBLIC_SCHEMA_ID: '',
    },
};

export default nextConfig;
