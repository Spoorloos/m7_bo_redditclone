let lastPost: string | undefined;
const posts = document.getElementById("posts")!;
const numFormat = new Intl.NumberFormat(undefined, { notation: "compact" });
const dateFormat = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

async function fetchRedditPosts() {
    const url = `https://www.reddit.com/.json?limit=10${lastPost ? `&after=${lastPost}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("API request failed");
    }

    const data = await response.json();
    const posts: any[] | undefined = data?.data?.children;
    if (!posts || posts.length === 0) {
        throw new Error("API didn't return posts");
    }

    lastPost = posts[posts.length - 1]?.data?.name;
    return posts;
}

function timeAgo(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return dateFormat.format(-diffSec, "second");
    if (diffMin < 60) return dateFormat.format(-diffMin, "minute");
    if (diffHr < 24) return dateFormat.format(-diffHr, "hour");

    return dateFormat.format(-diffDay, "day");
}

function createPost(postData: any) {
    const post = document.createElement("section");
    post.className = "post";

    const header = document.createElement("div");
    header.className = "post__header";

    const headerImage = document.createElement("img");
    headerImage.className = "post__header__img";
    headerImage.src = "/icon.jpg";

    const headerSubreddit = document.createElement("a");
    headerSubreddit.href = "";
    headerSubreddit.innerText = postData.subreddit_name_prefixed;

    const createdDate = new Date(postData.created * 1000);
    const headerTime = document.createElement("time");
    headerTime.className = "post__header__time";
    headerTime.dateTime = createdDate.toISOString();
    headerTime.innerText = timeAgo(createdDate);

    const headerJoinButton = document.createElement("button");
    headerJoinButton.className = "post__header__button";
    headerJoinButton.innerText = "Join";

    const headerDotsImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    headerDotsImage.classList.add("post__header__dots");
    headerDotsImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    headerDotsImage.setAttribute("viewBox", "0 -960 960 960");
    headerDotsImage.setAttribute("fill", "currentColor");
    headerDotsImage.innerHTML = '<path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"></path>';

    header.append(headerImage, headerSubreddit, headerTime, headerJoinButton, headerDotsImage);

    const content = document.createElement("div");
    content.className = "post__content";

    const contentParagraph = document.createElement("p");
    contentParagraph.className = "post__content__p";
    contentParagraph.innerText = postData.title;

    const contentImage = document.createElement("img");
    contentImage.className = "post__content__img";
    contentImage.src = postData.thumbnail;

    content.append(contentParagraph, contentImage);

    const footer = document.createElement("div");
    footer.className = "post__footer";

    const footerVote = document.createElement("button");
    footerVote.className = "post__footer__button";

    const footerVoteUp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    footerVoteUp.style.width = "1.25rem";
    footerVoteUp.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    footerVoteUp.setAttribute("viewBox", "0 0 20 20");
    footerVoteUp.setAttribute("fill", "currentColor");
    footerVoteUp.innerHTML = '<path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path>';

    const footerVoteCount = document.createElement("p");
    footerVoteCount.innerText = numFormat.format(postData.ups);

    const footerVoteDown = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    footerVoteDown.style.width = "1.25rem";
    footerVoteDown.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    footerVoteDown.setAttribute("viewBox", "0 0 20 20");
    footerVoteDown.setAttribute("fill", "currentColor");
    footerVoteDown.innerHTML = '<path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"></path>';

    footerVote.append(footerVoteUp, footerVoteCount, footerVoteDown);

    const footerComment = document.createElement("button");
    footerComment.className = "post__footer__button";

    const footerCommentImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    footerCommentImage.style.width = "1.25rem";
    footerCommentImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    footerCommentImage.setAttribute("viewBox", "0 -960 960 960");
    footerCommentImage.setAttribute("fill", "currentColor");
    footerCommentImage.innerHTML = '<path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"></path>';

    const footerCommentCount = document.createElement("p");
    footerCommentCount.innerText = numFormat.format(postData.num_comments);

    footerComment.append(footerCommentImage, footerCommentCount);

    const footerLeaderboard = document.createElement("button");
    footerLeaderboard.className = "post__footer__button";

    const footerLeaderboardImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    footerLeaderboardImage.style.width = "1.25rem";
    footerLeaderboardImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    footerLeaderboardImage.setAttribute("viewBox", "0 0 24 24");
    footerLeaderboardImage.setAttribute("fill", "currentColor");
    footerLeaderboardImage.innerHTML = '<path d="M5 8.999c0 1.902.765 3.627 2 4.89V21a.998.998 0 0 0 1.447.895L12 20.118l3.553 1.776a.992.992 0 0 0 .972-.043c.295-.183.475-.504.475-.851v-7.11a6.976 6.976 0 0 0 2-4.891C19 5.14 15.86 2 12 2S5 5.14 5 8.999zm7.447 9.106a1 1 0 0 0-.895 0L9 19.382v-4.067c.911.434 1.926.685 3 .685s2.089-.25 3-.685v4.066l-2.553-1.276zM12 4c2.756 0 5 2.242 5 4.999A5.006 5.006 0 0 1 12 14c-2.757 0-5-2.243-5-5.001A5.005 5.005 0 0 1 12 4z"></path>';

    footerLeaderboard.append(footerLeaderboardImage);

    const footerShare = document.createElement("button");
    footerShare.className = "post__footer__button";

    const footerShareImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    footerShareImage.style.width = "1.25rem";
    footerShareImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    footerShareImage.setAttribute("viewBox", "0 0 24 24");
    footerShareImage.setAttribute("fill", "currentColor");
    footerShareImage.innerHTML = '<path d="M11 7.05V4a1 1 0 0 0-1-1 1 1 0 0 0-.7.29l-7 7a1 1 0 0 0 0 1.42l7 7A1 1 0 0 0 11 18v-3.1h.85a10.89 10.89 0 0 1 8.36 3.72 1 1 0 0 0 1.11.35A1 1 0 0 0 22 18c0-9.12-8.08-10.68-11-10.95zm.85 5.83a14.74 14.74 0 0 0-2 .13A1 1 0 0 0 9 14v1.59L4.42 11 9 6.41V8a1 1 0 0 0 1 1c.91 0 8.11.2 9.67 6.43a13.07 13.07 0 0 0-7.82-2.55z"></path>';

    const footerShareText = document.createElement("p");
    footerShareText.innerText = "Share";

    footerShare.append(footerShareImage, footerShareText);
    footer.append(footerVote, footerComment, footerLeaderboard, footerShare);
    post.append(header, content, footer);
    posts.appendChild(post);
}

async function addNewPostsToDocument() {
    const posts = await fetchRedditPosts();
    for (const post of posts) {
        createPost(post.data);
    }
}

posts.addEventListener("scroll", () => {
    const reachedEnd = Math.abs(posts.scrollHeight - posts.clientHeight - posts.scrollTop) <= 1;
    if (reachedEnd) {
        addNewPostsToDocument();
    }
});

addNewPostsToDocument();