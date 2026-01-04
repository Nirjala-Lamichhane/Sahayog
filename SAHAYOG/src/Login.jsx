import { handleButtonClick } from "./utils/buttonAnimation";

function Login(){
    return(
       <>
           <button 
                onClick={(e) => {
                    handleButtonClick(e);
                    window.location.href="http://localhost:3000/auth/google"; //use navigate library for betterment 
                }}
                style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: "transform 0.1s ease",
                }}
           >
            Continue with Google
           </button>

       </>
    )


}
export default Login;