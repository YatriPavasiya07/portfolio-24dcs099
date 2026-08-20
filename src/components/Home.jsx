import { Routes, Route } from "react-router-dom";

import Header from "./Header";
import About from "./About";
import Skills from "./Skills";
import Footer from "./Footer";

function Home() {

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React"
  ];

  return (
    <>
      <Header name="Yatri" />

      <About />

      <Skills skillList={skills} />

      <Footer />
    </>
    
  );

}

export default Home;