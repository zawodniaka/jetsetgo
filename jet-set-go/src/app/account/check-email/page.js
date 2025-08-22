export default function CheckEmailPage() {
    return (

        <div className="pt-10 flex justify-center items-center">
            <div className="bg-white w-100 px-10 pb-10 border-radius-5">
                <h2 style={{fontFamily: 'sans-serif', color: 'black', textAlign: 'center', padding: '30px', fontWeight: 'bold', fontSize: '27px'}}>
                    Check Your Email!</h2>
                <p style={{fontFamily: 'sans-serif', color: 'black', textAlign: 'center'}}>
                    We have sent you a password reset link.</p>
                <br />
                <p style={{fontFamily: 'sans-serif', color: 'black', textAlign: 'center'}}> Please follow the instructions in the email.</p>
            </div>
        </div>
    );
}