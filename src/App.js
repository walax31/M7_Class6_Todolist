import React, { useState, useEffect } from "react";
import "./styles.css";

const GITHUB_API_ROOT = "https://api.github.com";
const AVAILABLE_REPOS = ["facebook/react", "angular/angular", "vuejs/vue"];

async function fetchData(repositoly) {
  const response = await fetch(`${GITHUB_API_ROOT}/repos/${repositoly}`);
  // const JSONresponse = await response.json()
  // return JSONresponse;
  return response.json();
}

export default function App() {
  const [repoList, setRepoList] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const handlefetch = async () => {
    setLoading(true);
    try {
      const githubResponse = await fetchData();
      setRepoData(githubResponse);
    } catch (err) {
      setError("There are somethings wrong,pleas try again later");
    }
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    const repoRequestPromises = AVAILABLE_REPOS.map((repo) => fetchData(repo));
    //[Promise<panding>,Promise<panding>,Promise<panding>]
    Promise.all(repoRequestPromises)
      .then((githubResponse) => setRepoList(githubResponse))

      .then((githubResponse) => setRepoData(githubResponse))
      .catch(() => setError("There are somethings wrong,pleas try again later"))
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  return (
    <div className="App">
      <div>
        <button onClick={handlefetch}>Fetch Data</button>
      </div>
      {!isLoading && repoList.length && (
        <div>
          {repoList.map((repo) => (
            <>
              <h3>name:{repo.full_name}</h3>
              <span>star:{repo.stargazers_count}</span>
            </>
          ))}
        </div>
      )}
    </div>
  );
}
