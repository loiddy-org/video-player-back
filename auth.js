const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const ssmParams = require('./ssm-params');

let app = null;

const initFirebase = async () => {
  const params = await ssmParams.get();
  const firebaseConfig = {
    apiKey: params.FIREBASE_API_KEY,
    authDomain: params.FIREBASE_AUTH_DOMAIN,
  };
  app = initializeApp(firebaseConfig);
};

exports.authMiddlewear = async (req, res, next) => {
  if (!app) await initFirebase();
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Unauthorized' });
  try {
    req.user = await getAuth(app).verifyIdToken(token);
    req.next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};
