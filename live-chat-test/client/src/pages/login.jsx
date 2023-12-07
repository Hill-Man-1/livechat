import { useContext } from 'react'
import { Button, Alert, Form, Row, Col, Stack } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
    const {
        isLoginLoading,
        loginError,
        loginUser,
        loginInfo,
        updateLoginInfo,
        } = useContext((AuthContext))

    return (
    <>
        <Form onSubmit={loginUser}>
            <Row
                style={{
                    height: '100vh',
                    justifyContent: 'center',
                    paddingTop: '10%',
                }}    
            >
                <Col xs={6}>
                <Stack gap={3}>
                    <h2 className='text-dark text-center'>Login</h2>
                    <Form.Control type='text' placeholder='Email or Username' onChange={(e) => updateLoginInfo({...loginInfo, emailOrUsername:e.target.value})}/>
                    <Form.Control type='password' placeholder='Password' onChange={(e) => updateLoginInfo({...loginInfo, password:e.target.value})}/>
                    <Button variant='primary' type='submit'>
                        {isLoginLoading? "Getting You In": "Login"}
                    </Button>
                    {loginError?.error && (<Alert variant='danger'>
                        <p>
                            {loginError?.message}
                        </p>
                    </Alert>)} 
                </Stack>
                </Col>
            </Row>
        </Form>
    </>
    )
}

export default Login