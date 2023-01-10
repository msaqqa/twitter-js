let loginPage = document.getElementById("login");
let loginForm = document.getElementById("loginForm");
let homePage = document.getElementById("home");
let sideName = document.getElementById("s-name");
let postsDiv = document.getElementById("posts");
let username;
let postForm = document.getElementById("postForm");

loginForm.onsubmit = (e) => {
  e.preventDefault();
  loginPage.style.display = "none";
  homePage.classList.remove("d-none");
  let userVlue = e.target.username.value;
  username = userVlue === "" ? "undefined" : userVlue;
  sideName.textContent = username;
};

let posts = [];
if (localStorage.getItem("posts")) {
  posts = JSON.parse(localStorage.getItem("posts"));
  if (posts.length) {
    renderPosts();
  }
}

function renderPosts() {
  postsDiv.innerHTML = "";
  posts.map((post) => {
    let postDiv = document.createElement("div");
    postDiv.className = "media p-3 border";
    let userImg = document.createElement("img");
    userImg.setAttribute("src", "./img/user.jpg");
    userImg.setAttribute("class", "mr-3");
    userImg.style.width = "40px";
    userImg.style.height = "40px";
    postDiv.appendChild(userImg);

    let postContent = document.createElement("div");
    postContent.className = `media-body ${post.isRetweet ? "border p-3" : ""}`;

    let postDetails = document.createElement("h5");
    postDetails.className = "mt-0";
    let span = document.createElement("span");
    span.className = "text-muted normal";
    span.textContent = username + post.date;
    postDetails.appendChild(span);
    postContent.appendChild(postDetails);

    let postDesc = document.createElement("p");
    postDesc.textContent = post.desc;
    postContent.appendChild(postDesc);

    if (post.img) {
      let imgDiv = document.createElement("div");
      imgDiv.className = "post-img";
      let postImg = document.createElement("img");
      postImg.setAttribute("src", post.img);
      postImg.setAttribute("class", "border w-100 h-100 rounded-lg");
      imgDiv.appendChild(postImg);
      postContent.appendChild(imgDiv);
    }

    let postInfo = document.createElement("div");
    postInfo.className = "row";

    let comDiv = document.createElement("div");
    comDiv.className = "col-3";
    postInfo.appendChild(comDiv);
    let comBtn = document.createElement("button");
    comBtn.className = "btn shadow-none";
    comDiv.appendChild(comBtn);
    let comIcon = document.createElement("i");
    comIcon.className = "far fa-comment text-muted";
    comIcon.textContent = " " + post.comments;
    comBtn.appendChild(comIcon);

    let retweetDiv = document.createElement("div");
    retweetDiv.className = "col-3";
    postInfo.appendChild(retweetDiv);
    let retweetBtn = document.createElement("button");
    retweetBtn.className = "btn shadow-none";
    retweetBtn.onclick = () => addRetweet(post.id);
    retweetDiv.appendChild(retweetBtn);
    let retweetIcon = document.createElement("i");
    retweetIcon.className = `fas fa-retweet btn ${
      post.retweet ? "text-success" : "text-muted"
    }`;
    retweetIcon.textContent = " " + post.retweetNum;
    retweetBtn.appendChild(retweetIcon);

    let likeDiv = document.createElement("div");
    likeDiv.className = "col-3";
    postInfo.appendChild(likeDiv);
    let likeBtn = document.createElement("button");
    likeBtn.className = "btn shadow-none";
    likeBtn.onclick = () => addLike(post.id);
    likeDiv.appendChild(likeBtn);
    let likeIcon = document.createElement("i");
    likeIcon.className = `fas fa-heart btn ${
      post.like ? "text-danger" : "text-muted"
    }`;
    likeIcon.textContent = " " + post.likeNum;
    likeBtn.appendChild(likeIcon);

    let shareDiv = document.createElement("div");
    shareDiv.className = "col-3";
    postInfo.appendChild(shareDiv);
    let shareBtn = document.createElement("button");
    shareBtn.className = "btn shadow-none";
    shareDiv.appendChild(shareBtn);
    let shareIcon = document.createElement("i");
    shareIcon.className = "fas fa-upload btn text-muted";
    shareIcon.textContent = " " + post.shareNum;
    shareBtn.appendChild(shareIcon);

    postContent.appendChild(postInfo);
    postDiv.appendChild(postContent);
    postsDiv.appendChild(postDiv);
  });
}

postForm.onsubmit = (e) => {
  e.preventDefault();
  let desc = e.target.desc.value;
  let img = e.target.postImg.files[0];
  let newPost = {
    id: Math.random(),
    date: new Date().toLocaleString(),
    desc: desc,
    img: img ? URL.createObjectURL(img) : null,
    comments: 0,
    retweetNum: 0,
    likeNum: 0,
    shareNum: 0,
    like: false,
    retweet: false,
    isRetweet: false,
  };
  if (desc || img) {
    posts.unshift(newPost);
    e.target.desc.value = "";
    e.target.postImg.files[0] = null;
    renderPosts();
    addPostsToLocalStorage(posts);
  }
};

addLike = (id) => {
  posts.find((post) => {
    if (post.id === id) {
      post.like = true;
      post.likeNum = 1;
    }
  });
  renderPosts();
  addPostsToLocalStorage(posts);
};

addRetweet = (id) => {
  posts.find((post) => {
    if (post.id === id) {
      if (!post.retweet) {
        post.retweet = true;
        post.retweetNum = 1;
        posts.unshift({ ...post, isRetweet: true });
      }
      // else {
      //   window.alert("This tweet has already been retweeted");
      // }
    }
  });
  renderPosts();
  addPostsToLocalStorage(posts);
};

function addPostsToLocalStorage(posts) {
  window.localStorage.setItem("posts", JSON.stringify(posts));
}
