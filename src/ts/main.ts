import { format } from "timeago.js";

let lastPost: string | undefined;
const postsEnd = document.getElementById("posts__end")!;
const numFormat = new Intl.NumberFormat(undefined, { notation: "compact" });

async function getSubredditIcon(subredditName: string) {
    const url = `https://www.reddit.com/r/${subredditName}/about.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const subredditIconUrl: string | undefined = data?.data?.icon_img;

        if (subredditIconUrl) {
            return subredditIconUrl;
        }
    } catch (error) {
        console.error("Error fetching subreddit data:", error);
    }

    return "";
}

async function fetchRedditPosts() {
    const url = `https://www.reddit.com/.json?limit=10${lastPost ? `&after=${lastPost}` : ""}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const posts: any[] | undefined = data?.data?.children;

        if (!posts || posts.length === 0) {
            throw new Error("API didn't return posts");
        }

        lastPost = posts[posts.length - 1]?.data?.name;
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }

    return [];
}

async function createPost(postData: any) {
    const subreddit = postData?.subreddit ?? "";
    const created = postData?.created ?? 0;
    const title = postData?.title ?? "";
    const thumbnail = postData?.thumbnail ?? "";
    const url = postData?.url ?? "";
    const upvotes = postData?.ups ?? 0;
    const numComments = postData?.num_comments ?? 0;

    postsEnd.insertAdjacentHTML("beforebegin", /*html*/`
        <section class="space-y-4 w-full max-w-3xl py-4">
            <div class="flex items-center gap-2 mb-3">
                <img class="w-9 h-auto rounded-full" src="${await getSubredditIcon(subreddit)}"/>
                <a href="${`https://www.reddit.com/r/${subreddit}`}">${`r/${subreddit}`}</a>
                <time class="text-gray-400">${format(created * 1000)}</time>
                <button class="py-1 px-4 rounded-4xl bg-blue-800 text-white ml-auto cursor-pointer hover:bg-blue-700">Join</button>
                <svg class="size-8 p-1 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 rounded-full" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"></path></svg>
            </div>
            <div class="flex gap-2 flex-grow-0 justify-between relative">
                <p class="font-bold mb-3">${title}</p>
                <img class="flex-none w-40 h-30 rounded-2xl object-cover" src="${thumbnail}"/>
                <a class="absolute inset-0" href=${url}></a>
            </div>
            <div class="flex gap-5 items-center h-10">
                <div class="flex items-center gap-1 bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 h-full rounded-3xl px-3 py-1 cursor-pointer">
                    <svg class="w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path></svg>
                    <p>${numFormat.format(upvotes)}</p>
                    <svg class="w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"></path></svg>
                </div>
                <div class="flex items-center gap-1 bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 h-full rounded-3xl px-3 py-1 cursor-pointer">
                    <svg class="w-5" viewBox="0 -960 960 960" fill="currentColor"><path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"></path></svg>
                    <p>${numFormat.format(numComments)}</p>
                </div>
                <div class="flex items-center gap-1 bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 h-full rounded-3xl px-3 py-1 cursor-pointer">
                    <svg class="w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 8.999c0 1.902.765 3.627 2 4.89V21a.998.998 0 0 0 1.447.895L12 20.118l3.553 1.776a.992.992 0 0 0 .972-.043c.295-.183.475-.504.475-.851v-7.11a6.976 6.976 0 0 0 2-4.891C19 5.14 15.86 2 12 2S5 5.14 5 8.999zm7.447 9.106a1 1 0 0 0-.895 0L9 19.382v-4.067c.911.434 1.926.685 3 .685s2.089-.25 3-.685v4.066l-2.553-1.276zM12 4c2.756 0 5 2.242 5 4.999A5.006 5.006 0 0 1 12 14c-2.757 0-5-2.243-5-5.001A5.005 5.005 0 0 1 12 4z"></path></svg>
                </div>
                <div class="flex items-center gap-1 bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 h-full rounded-3xl px-3 py-1 cursor-pointer">
                    <svg class="w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7.05V4a1 1 0 0 0-1-1 1 1 0 0 0-.7.29l-7 7a1 1 0 0 0 0 1.42l7 7A1 1 0 0 0 11 18v-3.1h.85a10.89 10.89 0 0 1 8.36 3.72 1 1 0 0 0 1.11.35A1 1 0 0 0 22 18c0-9.12-8.08-10.68-11-10.95zm.85 5.83a14.74 14.74 0 0 0-2 .13A1 1 0 0 0 9 14v1.59L4.42 11 9 6.41V8a1 1 0 0 0 1 1c.91 0 8.11.2 9.67 6.43a13.07 13.07 0 0 0-7.82-2.55z"></path></svg>
                    <p>Share</p>
                </div>
            </div>
        </section>
    `);
}

async function addNewPostsToDocument() {
    const posts = await fetchRedditPosts();

    await Promise.all(posts.map((post) => {
        return createPost(post.data);
    }));
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        addNewPostsToDocument();
    }
});

observer.observe(postsEnd);