import "./css/signin.scss";
import { BsArrowRightShort } from "react-icons/bs";

function SignIn() {
  return (
    <>
      <div className="macro-container">
        <div className="mini-container">
          <h3>Get started with KoinX for FREE</h3>
          <p>
            With our range of features that you can equip for free, KoinX allows
            you to be more educated and aware about your tax reports.
          </p>
          <img src="/images/welcome.png" alt="Welcome" />
          <button>
            Get started for FREE
            <BsArrowRightShort />
          </button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
