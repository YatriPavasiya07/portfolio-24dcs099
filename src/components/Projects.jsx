import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

function Projects() {

const [repos, setRepos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {

  fetch("https://api.github.com/users/YatriPavasiya07/repos")

    .then((res) => res.json())

    .then((data) => setRepos(data))

    .catch((err) => setError(err.message))

    .finally(() => setLoading(false));

}, []);

if (loading) {
  return <Spinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

return (
  <section>
    <h2>My GitHub Projects</h2>

    <div className="repo-container">

      {repos.map((repo) => (
        <div className="repo-card" key={repo.id}>

          <h3>{repo.name}</h3>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repository
          </a>

        </div>
      ))}

    </div>

  </section>
);

}

export default Projects;