// Load the first page of character list
queryCharData({ page: 1 });

// Load All Episodes

function queryEpisodesData(variables) {
  return fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query getEpisodes($page: Int){	
        episodes(page: $page){
         results{
            id
           name,
           episode,
           characters{
              name,
              image,
           },
           created
         }
       }
      }`,
      variables: variables,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      charPages.classList.remove("show");
      episodePages.classList.add("show");
      locationPages.classList.remove("show");
      backBtnCover.classList.remove("show");
      characterWrap.innerHTML = "";
      data.data.episodes.results.forEach((result) => {
        characterWrap.innerHTML += `
        <div class="card episode" data-id="${result.id}">
        <div class="card-body">
          <div>
            <h3 class="card-title">${result.name}</h3>
            <ul>
              <li>Episode: ${result.episode}</li>
              <li>Created: ${moment(result.created).format("MMM Do YYYY")}</li>
              <li>Total Characters: ${result.characters.length}</li>
            </ul>
          </div>
          <button data-info>View Characters</button>
        </div>
      </div> 
        `;
        queryEpisodeData(variables);
      });
    })
    .catch((err) => {
      characterWrap.innerHTML = `<h1>There was an error occured</h1>`;
    });
}

// button parent: toggling display when on character list page
const backBtnCover = document.querySelector(".go-back-btn");

function queryEpisodeData(variables) {
  const btn = document.querySelectorAll("[data-info]");
  const backBtn = document.querySelector("[data-back]");

  btn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let currentId = e.target.closest("[data-id]").getAttribute(["data-id"]);
      fetch("https://rickandmortyapi.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
      query getEpisode($id: ID!){	
        episode(id: $id){
                name,
                air_date,
                episode,
                characters{
                  name,
                  image
                },
                created
        }
      }`,
          variables: { id: currentId },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const characters = data.data.episode.characters;
          // make popUp using data
          characterWrap.innerHTML = "";
          characters.forEach((char) => {
            characterWrap.innerHTML += `
              <div class="img" data-name="${char.name}">
                <img src="${char.image}" alt="">
                <div class="overlay">
              </div>`;
          });
          backBtnCover.classList.add("show");
          goBackPage(backBtn);
        })
        .catch((err) => {
          characterWrap.innerHTML = `<h1>There was an error occured</h1>`;
        });
    });
  });
}

// Go back based on recent page visit on episode list
function goBackPage(button) {
  button.addEventListener("click", () => {
    // episode pagination converting to array
    const episodePagesSelector = [...episodePages.children];
    // selecting active page
    let activePage = episodePagesSelector.filter((page) => {
      return page.classList.contains("active");
    });

    // add loader
    characterWrap.innerHTML = `
    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>`;

    // query episodes
    queryEpisodesData({ page: parseInt(activePage[0].textContent) });
  });
}

// Load All Locations

function queryLocationData(variables) {
  return fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query getLocations($page: Int){	
        locations(page: $page){
          results{
            name,
            type,
            dimension,
            residents{
              name,
              image
            },
            created
          }
        }
      }`,
      variables: variables,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      charPages.classList.remove("show");
      episodePages.classList.remove("show");
      locationPages.classList.add("show");
      backBtnCover.classList.remove("show");
      characterWrap.innerHTML = "";

      data.data.locations.results.forEach((result) => {
        characterWrap.innerHTML += `      
          <div class="card location">     
            <div class="card-body"> 
              <h3 class="card-title">${result.name}</h3>
              <ul>
                <li>Dimension: ${result.dimension}</li>
                <li>Type: ${result.type}</li>
                <li>Created: ${moment(result.created).format(
                  "MMM Do YYYY"
                )}</li>
                <li>Known Characters: ${result.residents.length}</li>
              </ul>
            </div>
          <div>
        `;
      });
    })
    .catch((err) => {
      characterWrap.innerHTML = `<h1>There was an error occured</h1>`;
    });
}

// main content
const characterWrap = document.querySelector(".character-wrap");

// individual pagination
const charPages = document.querySelector(".characters-page");
const episodePages = document.querySelector(".episodes-page");
const locationPages = document.querySelector(".locations-page");

// all pages
const allPages = document.querySelectorAll(".pagination li");

allPages.forEach((page) => {
  // for switch active classes
  page.addEventListener("click", (e) => {
    allPages.forEach((page) => {
      page.classList.remove("active");
      page.removeAttribute("aria-current");
    });

    // add class on selected page
    let currentPage = e.target.closest(".page-item");
    currentPage.classList.add("active");
    currentPage.setAttribute("aria-current", "page");

    // find active link
    let links = [...e.target.offsetParent.children[0].children[1].children];
    let activeLink = links.find((link) => {
      return link.classList.contains("active");
    });

    // add loader
    characterWrap.innerHTML = `
    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>`;
    // switch pages based on selected link
    if (activeLink.textContent == "Characters") {
      queryCharData({ page: parseInt(currentPage.textContent) });
    }
    if (activeLink.textContent == "Episodes") {
      queryEpisodesData({ page: parseInt(currentPage.textContent) });
    }
    if (activeLink.textContent == "Locations") {
      queryLocationData({ page: parseInt(currentPage.textContent) });
    }
  });
});

// Querying Character Data
function queryCharData(variables) {
  return fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query getCharacters($page: Int){
        characters(page: $page){
            results{
                name,
                gender,
                status,
                species,
                origin{
                    name
                },
                episode{
                    name
                },
                created
                image
            }
          }
        }
      `,
      variables: variables,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      charPages.classList.add("show");
      episodePages.classList.remove("show");
      locationPages.classList.remove("show");
      backBtnCover.classList.remove("show");
      characterWrap.innerHTML = "";
      data.data.characters.results.forEach((result) => {
        characterWrap.innerHTML += `
      <div class="card">
          <img src="${result.image}" class="card-img" alt="poster" />
          <div class="card-body text-left">
            <h3 class="card-title">${result.name}</h3>
            <ul>
              <li>Gender: ${result.gender}</li>
              <li>Status: ${result.status}</li>
              <li>Species: ${result.species}</li>
              <li>Origin: ${result.origin.name}</li>
              <li>First Episode: ${result.episode[0].name}</li>
              <li>Created: ${moment(result.created).format("MMM Do YYYY")}</li>
            </ul>
          </div>
        </div>
        `;
      });
    })
    .catch((err) => {
      characterWrap.innerHTML = `<h1>There was an error occured</h1>`;
    });
}

// Nav link
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  // for switch active classes
  link.addEventListener("click", (e) => {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
    let currentLink = e.target.closest(".nav-link");
    currentLink.classList.add("active");
    currentLink.setAttribute("aria-current", "current");

    // add loader
    characterWrap.innerHTML = `
    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>`;

    // get the first pages every tab
    const firstPages = [...allPages].filter((page) => {
      return page.attributes["data-first"];
    });

    // display page 1 based on selected link and reset to 1 the selected page
    if (currentLink.textContent === "Characters") {
      queryCharData({ page: 1 });
      resetToFirstPage(allPages, firstPages, 0);
    }
    if (currentLink.textContent === "Episodes") {
      queryEpisodesData({ page: 1 });
      resetToFirstPage(allPages, firstPages, 1);
    }
    if (currentLink.textContent === "Locations") {
      queryLocationData({ page: 1 });
      resetToFirstPage(allPages, firstPages, 2);
    }
  });
});

function resetToFirstPage(pages, first, index) {
  pages.forEach((page) => {
    page.classList.remove("active");
    page.removeAttribute("aria-current");
  });
  first[index].classList.add("active");
  first[index].setAttribute("aria-current", "page");
}
