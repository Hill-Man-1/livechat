import { useContext } from "react";
import { Container, Navbar, Nav, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";



const NavBar = () => {
    const {user, logoutUser} = useContext (AuthContext)
    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to="/" className="text-light text-decoration-none">
                        ChatApp
                    </Link>
                </h2>
                {user && (<>
                    <span className="text-warning">Login as {user?.firstname}</span>
                </>)}
            <Nav>
                <Stack direction="horizontal" gap={3}>
                    {user && (<>
                        <Link onClick={() => logoutUser()} to="/login" className="text-light text-decoration-none">
                        Logout
                        </Link>    
                    </>)}

                    {!user &&(<>
                        <Link to="/login" className="text-light text-decoration-none">
                            Login
                        </Link>
                        <Link to="/register" className="text-light text-decoration-none">
                            Register
                        </Link>
                    </>)}
                </Stack>
            </Nav>
            </Container>
    </Navbar>
    );
}

export default NavBar;
