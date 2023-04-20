module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'picsum.photos', 'testnet.madnfts.io', 'mainnet.madnfts.io', 'madnfts.io']
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your proj  ect has type errors.
    // !! WARN !!
    ignoreBuildErrors: false
  },
  env: {
    REACT_INFURA_KEY: process.env.REACT_INFURA_KEY,
    REACT_APP_PINATA_JWT_SECRET: process.env.REACT_APP_PINATA_JWT_SECRET,
    REACT_APP_AWS_ACCESS_KEY_ID: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    REACT_APP_AWS_SECRET_ACCESS_KEY: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    REACT_APP_AWS_DEFAULT_REGION: process.env.REACT_APP_AWS_DEFAULT_REGION,
    REACT_APP_AWS_BUCKET: process.env.REACT_APP_AWS_BUCKET,
    REACT_APP_AWS_BUCKET_FIXED: process.env.REACT_APP_AWS_BUCKET_FIXED,
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK
      ? process.env.NEXT_PUBLIC_NETWORK
      : 'staging-utter-unripe-menkar',
    NEXT_PUBLIC_API_ENV: process.env.NEXT_PUBLIC_API_ENV
      ? process.env.NEXT_PUBLIC_API_ENV
      : 'mainnet',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID ? process.env.NEXT_PUBLIC_GA_ID : null
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.testnet.madnfts.io/api/:path*'
      }
    ]
  }
}
