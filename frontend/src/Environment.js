let environment;

if (process.env.NODE_ENV === 'production') {
  environment = {
    endpoint: 'https://my-broduction-backend'
  };
} else {
  environment = {
    endpoint: 'http://localhost:8000'
  };
}

export default environment;
