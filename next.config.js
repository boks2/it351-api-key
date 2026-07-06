// Burahin mo yung /** @type ... */ sa taas para hindi mag-validate ang TS
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;