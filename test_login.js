const axios = require('axios');

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:3002/api/V1/auth/login', {
            email: 'admin@mail.com',
            password: 'password'
        });
        console.log('Login successful:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Login failed:');
        console.error(error);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error message:', error.message);
        }
    }
};

testLogin();
