module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '48f373743ccfade862257633cc0cd1dd'),
  },
});
