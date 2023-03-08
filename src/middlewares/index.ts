const corsOptions = {
    origin: process.env.ORIGIN_CLOUD || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    AccessControlAllowOrigin:['*']
  };
  
  export default corsOptions;
  
  