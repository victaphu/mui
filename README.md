# MADNFTs React UI 1.x

---
### Overview
This repo contains the React codebase for the madnfts.io consumer UI. Among many other things we leverage the following tools to create the UI / UX:
- npm
- Next.js
- React
- Readux toolkit
- Typescript
- Web3 react
- Ethers.js
- TailwindCSS

---
### Development

To get going install the packages, create your .env file and update the .env parameters:
```
npm install
cp .env-example .env
```

Run the development server:
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run builds locally to catch any type errors:
```
npm run build
```

---
### Environments

Our system is designed with multiple networks and environments in mind. Networks and api routes are configured at constants/networks.ts and constants/domain.ts.

The api domain is controlled by the **NEXT_PUBLIC_API_ENV** .env variable:
```
# mainnet API
NEXT_PUBLIC_API_ENV='mainnet'

# testnet API
NEXT_PUBLIC_API_ENV='testnet'

# locahost API
NEXT_PUBLIC_API_ENV='local'

# testnet API using next rewrites, this allows local to consume cross domain cookies with the testnet API 
NEXT_PUBLIC_API_ENV='local-rewtire'
```

The default network is controlled by the **NEXT_PUBLIC_NETWORK** .env variable:
```
NEXT_PUBLIC_NETWORK='harmony' | 'goerli' | 'local’
```

---
### Deployment pipeline

We use Vercel for deployments builds and hosting. Vercel deploys for `main` and `development` branches, along with branch preview builds if the developers has necessary accesses.

* madnfts.io (Production branch deployment)
* testnet.madnfts.io (Development branch deployment)

---
### Versioning

We use the format X.Y.Z. X is the major version, Y is the minor version, and Z is the patch version. Each element MUST increase numerically.

| Major | Minor | Patch |
| ----- | ----- | ----- |
| 1     | 3     | 2     |
