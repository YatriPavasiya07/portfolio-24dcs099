import { useState } from "react";

function Contact() {

  const [message, setMessage] = useState("");

  const [showHelp, setShowHelp] = useState(false);

  return (

    <section>

      <h2>Contact Me</h2>

      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
      />

      <p>You typed:</p>

      <h3>{message}</h3>

      <button onClick={()=>setShowHelp(!showHelp)}>

        Toggle Help

      </button>

      {showHelp &&

      <p>
      Enter your message above. It will appear instantly.
      </p>

      }

    </section>

  );

}

export default Contact;