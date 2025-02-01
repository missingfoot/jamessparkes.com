## Content from https://www.instantdb.com/docs

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/</docs/init>)
    * [Modeling data](https://www.instantdb.com/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/</docs/backend>)
    * [Patterns](https://www.instantdb.com/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/</docs/emails>)
    * [App teams](https://www.instantdb.com/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/</docs/storage>)


[Pricing](https://www.instantdb.com/</pricing>)[Examples](https://www.instantdb.com/</examples>)[Essays](https://www.instantdb.com/</essays>)[Docs](https://www.instantdb.com/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/</dash>)
[Sign up](https://www.instantdb.com/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/</docs/init>)
    * [Modeling data](https://www.instantdb.com/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/</docs/backend>)
    * [Patterns](https://www.instantdb.com/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/</docs/emails>)
    * [App teams](https://www.instantdb.com/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Introduction
# Getting started
Instant is the Modern Firebase. With Instant you can easily build realtime and collaborative apps like Notion or Figma.
Curious about what it's all about? Try a [demo](https://www.instantdb.com/<https:/instantdb.com/tutorial>). Have questions? [Join us on discord!](https://www.instantdb.com/<https:/discord.com/invite/VU53p7uQcE>)
And if you're ready, follow the quick start below to **build a live app in less than 5 minutes!**
## Quick start
To use Instant in a brand new project, fire up your terminal and run the following:
```
npx create-next-app -e hello-world instant-demo
cd instant-demo
npm i @instantdb/react
npm run dev

```

Copy
Now open up `app/page.tsx` in your favorite editor and replace the entirety of the file with the following code.
```
"use client";
import{ id, i, init,InstaQLEntity}from"@instantdb/react";
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
// Optional: Declare your schema!
const schema = i.schema({
entities:{
todos: i.entity({
text: i.string(),
done: i.boolean(),
createdAt: i.number(),
}),
},
});
type Todo=InstaQLEntity<typeof schema,"todos">;
const db =init({appId:APP_ID, schema });
functionApp(){
// Read Data
const{ isLoading, error, data }= db.useQuery({todos:{}});
if(isLoading){
return;
}
if(error){
return<div>Error querying data:{error.message}</div>;
}
const{ todos }= data;
return(
<div style={styles.container}>
<div style={styles.header}>todos</div>
<TodoForm todos={todos}/>
<TodoList todos={todos}/>
<ActionBar todos={todos}/>
<div style={styles.footer}>
Open another tab to see todos update in realtime!
</div>
</div>
);
}
// Write Data
// ---------
functionaddTodo(text: string){
 db.transact(
  db.tx.todos[id()].update({
   text,
done:false,
createdAt:Date.now(),
})
);
}
functiondeleteTodo(todo:Todo){
 db.transact(db.tx.todos[todo.id].delete());
}
functiontoggleDone(todo:Todo){
 db.transact(db.tx.todos[todo.id].update({done:!todo.done}));
}
functiondeleteCompleted(todos:Todo[]){
const completed = todos.filter((todo)=> todo.done);
const txs = completed.map((todo)=> db.tx.todos[todo.id].delete());
 db.transact(txs);
}
functiontoggleAll(todos:Todo[]){
const newVal =!todos.every((todo)=> todo.done);
 db.transact(todos.map((todo)=> db.tx.todos[todo.id].update({done: newVal })));
}
// Components
// ----------
functionTodoForm({ todos }:{todos:Todo[]}){
return(
<div style={styles.form}>
<div style={styles.toggleAll} onClick={()=>toggleAll(todos)}>
    ⌄
</div>
<form
    onSubmit={(e)=>{
     e.preventDefault();
addTodo(e.target[0].value);
     e.target[0].value="";
}}
>
<input
     style={styles.input}
     autoFocus
     placeholder="What needs to be done?"
     type="text"
/>
</form>
</div>
);
}
functionTodoList({ todos }:{todos:Todo[]}){
return(
<div style={styles.todoList}>
{todos.map((todo)=>(
<div key={todo.id} style={styles.todo}>
<input
      type="checkbox"
      key={todo.id}
      style={styles.checkbox}
      checked={todo.done}
      onChange={()=>toggleDone(todo)}
/>
<div style={styles.todoText}>
{todo.done?(
<span style={{textDecoration:"line-through"}}>
{todo.text}
</span>
):(
<span>{todo.text}</span>
)}
</div>
<span onClick={()=>deleteTodo(todo)} style={styles.delete}>
      𝘟
</span>
</div>
))}
</div>
);
}
functionActionBar({ todos }:{todos:Todo[]}){
return(
<div style={styles.actionBar}>
<div>Remaining todos:{todos.filter((todo)=>!todo.done).length}</div>
<div style={{cursor:"pointer"}} onClick={()=>deleteCompleted(todos)}>
DeleteCompleted
</div>
</div>
);
}
// Styles
// ----------
conststyles:Record<string,React.CSSProperties>={
container:{
boxSizing:"border-box",
fontFamily:"code, monospace",
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
flexDirection:"column",
},
header:{
letterSpacing:"2px",
fontSize:"50px",
color:"lightgray",
marginBottom:"10px",
},
form:{
boxSizing:"inherit",
display:"flex",
border:"1px solid lightgray",
borderBottomWidth:"0px",
width:"350px",
},
toggleAll:{
fontSize:"30px",
cursor:"pointer",
marginLeft:"11px",
marginTop:"-6px",
width:"15px",
marginRight:"12px",
},
input:{
backgroundColor:"transparent",
fontFamily:"code, monospace",
width:"287px",
padding:"10px",
fontStyle:"italic",
},
todoList:{
boxSizing:"inherit",
width:"350px",
},
checkbox:{
fontSize:"30px",
marginLeft:"5px",
marginRight:"20px",
cursor:"pointer",
},
todo:{
display:"flex",
alignItems:"center",
padding:"10px",
border:"1px solid lightgray",
borderBottomWidth:"0px",
},
todoText:{
flexGrow:"1",
overflow:"hidden",
},
delete:{
width:"25px",
cursor:"pointer",
color:"lightgray",
},
actionBar:{
display:"flex",
justifyContent:"space-between",
width:"328px",
padding:"10px",
border:"1px solid lightgray",
fontSize:"10px",
},
footer:{
marginTop:"20px",
fontSize:"10px",
},
};
exportdefaultApp;

```

Copy
Go to `localhost:3000` and follow the final instruction to load the app!
Huzzah 🎉 You've got your first Instant web app running! Check out the [Working with data](https://www.instantdb.com/</docs/init>) section to learn more about how to use Instant :)
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/<https:/instantdb.com/docs/storage>)
Next
    [Init →](https://www.instantdb.com/</docs/init>)
## On this page
  1. ### [Quick start](https://www.instantdb.com/</docs#quick-start>)




## Content from https://www.instantdb.com/docs/auth

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Authentication and Permissions
# Auth
Instant comes with support for auth. We currently offer [magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>), [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>), [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>), and [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>). If you want to build your own flow, you can use the [Admin SDK](https://www.instantdb.com/docs/</docs/backend#custom-auth>).
## [Magic CodesSend login codes to your users via email. Removes the need for passwords!](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
## [Google OAuthWe provide flows for Web and React Native to enable Google OAuth for your app.](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
## [Sign In with AppleSign In to native apps with Apple ID.](https://www.instantdb.com/docs/</docs/auth/apple>)
## [ClerkIntegrate Clerk's auth flow with Instant.](https://www.instantdb.com/docs/</docs/auth/clerk>)
## [Custom AuthIntegrate your own auth flow with the Admin SDK.](https://www.instantdb.com/docs/</docs/backend#custom-auth>)
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Showcase](https://www.instantdb.com/docs/</docs/showcase>)
Next
    [Magic codes →](https://www.instantdb.com/docs/</docs/auth/magic-codes>)


## Content from https://www.instantdb.com/docs/auth/apple

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/auth/</pricing>)[Examples](https://www.instantdb.com/docs/auth/</examples>)[Essays](https://www.instantdb.com/docs/auth/</essays>)[Docs](https://www.instantdb.com/docs/auth/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/auth/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/auth/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/auth/</dash>)
[Sign up](https://www.instantdb.com/docs/auth/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Authentication and Permissions
# Sign In with Apple
Instant supports Sign In with Apple on the Web and in native applications.
## Web Popup (recommended)
Use Apple-provided popup to authenticate users
## Web Redirect
Use redirect flow to authenticate users
## React Native
Authenticating in React Native app
## Step 1: Create App ID
  * Navigate to [Certificates, Identifiers & Profiles](https://www.instantdb.com/docs/auth/<https:/developer.apple.com/account/resources/identifiers/list>)
  * Select _Identifiers_
  * Click _+_
  * _Register a new identifier_ → Select _App IDs_
  *  _Select a type_ → Select _App_
  *  _Capabilities_ → _Sign In with Apple_ → Check
  * Fill in _Bundle ID_ and _Description_
  * Click _Register_


## Step 2: Create Services ID
  * Navigate to [Services IDs](https://www.instantdb.com/docs/auth/<https:/developer.apple.com/account/resources/identifiers/list/serviceId>)
  * Click _+_
  * _Register a new identifier_ → Select _Services IDs_
  * Fill in _Description_ and _Identifier_. You’ll need this _Identifier_ later
  * Click _Register_


## Step 3: Configure Services ID (Web Popup flow)
  * Select newly created Services ID
  * Enable _Sign In with Apple_
  * Click _Configure_
  * Select _Primary App ID_ from Step 1
  * To _Domains_ , add your app domain (e.g. `myapp.com`)
  * To _Return URLs_ , add URL of your app where authentication happens (e.g. `https://myapp.com/signin`)
  * Click _Continue_ → _Save_


## Step 4: Register your OAuth client with Instant
  * Go to the Instant dashboard and select _Auth_ tab.
  * Select _Add Apple Client_
  * Select unique _clientName_ (`apple` by default, will be used in `db.auth` calls)
  * Fill in _Services ID_ from Step 2


  * Click `Add Apple Client`


## Step 5: Add Sign In code to your app (Web Popup flow)
Add Apple Sign In library to your app:
```
https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js

```

Initialize with `Services ID` from Step 2:
```
AppleID.auth.init({
clientId:'<Services ID>',
scope:'name email',
redirectURI:window.location.href,
});

```

Copy
Implement `signInPopup` using `clientName` from Step 4:
```
asyncfunctionsignInPopup(){
let nonce = crypto.randomUUID();
// authenticate with Apple
let resp =awaitAppleID.auth.signIn({
nonce: nonce,
usePopup:true
});
// authenticate with Instant
await db.auth.signInWithIdToken({
clientName:"<clientName>",
idToken: resp.authorization.id_token,
nonce: nonce,
});
}

```

Copy
Add Sign In button:
```
<button onClick={signInPopup}>
SignInwithApple
</button>

```

Copy
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/storage>)
Previous
    [← Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
Next
    [Clerk →](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
## On this page
  1. ### [Step 1: Create App ID](https://www.instantdb.com/docs/auth/</docs/auth/apple#step-1-create-app-id>)
  2. ### [Step 2: Create Services ID](https://www.instantdb.com/docs/auth/</docs/auth/apple#step-2-create-services-id>)
  3. ### [Step 4: Register your OAuth client with Instant](https://www.instantdb.com/docs/auth/</docs/auth/apple#step-4-register-your-o-auth-client-with-instant>)




## Content from https://www.instantdb.com/docs/auth/clerk

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/auth/</pricing>)[Examples](https://www.instantdb.com/docs/auth/</examples>)[Essays](https://www.instantdb.com/docs/auth/</essays>)[Docs](https://www.instantdb.com/docs/auth/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/auth/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/auth/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/auth/</dash>)
[Sign up](https://www.instantdb.com/docs/auth/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Authentication and Permissions
# Clerk
Instant supports delegating auth to Clerk.
## Setup
**Step 1: Configure Clerk**
Go to your Clerk dashboard, navigate to `Sessions`[](https://www.instantdb.com/docs/auth/<https:/dashboard.clerk.com/last-active?path=sessions>), then click the `Edit` button in the `Customize session token` section.
Add the email claim to your session token:
```
{
"email":"{{user.primary_email_address}}"
}

```

Copy
You can have additional claims as long as the `email` claim is set to `{{user.primary_email_address}}`.
![Clerk token form](https://www.instantdb.com/img/docs/clerk-token-form.png)
**Step 2: Get your Clerk Publishable key**
On the Clerk dashboard, navigate to `API keys`[](https://www.instantdb.com/docs/auth/<https:/dashboard.clerk.com/last-active?path=api-keys>), then copy the `Publishable key`. It should start with `pk_`.
**Step 3: Register your Clerk Publishable key with your instant app**
Go to the Instant dashboard, navigate to the `Auth` tab and add a new clerk app with the publishable key you copied.
## Usage
Use Clerk's `getToken` helper to get a session JWT for your signed-in user. Then call Instant's `db.auth.signInWithIdToken` with the JWT and the client name you set on the Instant dashboard.
When you call `db.auth.signInWithIdToken`, Instant will verify that the JWT was signed by your Clerk app. If verified, Instant use the email in the JWT's claims to lookup your user or create a new one and create a long-lived session. Be sure to call Instant's `db.auth.signOut` when you want to sign the user out.
Here is a full example using clerk's next.js library:
```
'use client';
import{
 useAuth,
ClerkProvider,
SignInButton,
SignedIn,
SignedOut,
}from'@clerk/nextjs';
import{ init }from'@instantdb/react';
import{ useEffect }from'react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
const db =init({appId:APP_ID});
// Use the clerk client name you set in the Instant dashboard auth tab
constCLERK_CLIENT_NAME='REPLACE_ME';
functionClerkSignedInComponent(){
const{ getToken, signOut }=useAuth();
constsignInToInstantWithClerkToken=async()=>{
// getToken gets the jwt from Clerk for your signed in user.
const idToken =awaitgetToken();
if(!idToken){
// No jwt, can't sign in to instant
return;
}
// Create a long-lived session with Instant for your clerk user
// It will look up the user by email or create a new user with
// the email address in the session token.
  db.auth.signInWithIdToken({
clientName:CLERK_CLIENT_NAME,
idToken: idToken,
});
};
useEffect(()=>{
signInToInstantWithClerkToken();
},[]);
const{ isLoading, user, error }= db.useAuth();
if(isLoading){
return<div>Loading...</div>;
}
if(error){
return<div>Error signing in to Instant!{error.message}</div>;
}
if(user){
return(
<div>
<p>SignedinwithInstant through Clerk!</p>{' '}
<button
     onClick={()=>{
// First sign out of Instant to clear the Instant session.
      db.auth.signOut().then(()=>{
// Then sign out of Clerk to clear the Clerk session.
signOut();
});
}}
>
Sign out
</button>
</div>
);
}
return(
<div>
<button onClick={signInToInstantWithClerkToken}>
Signin to Instant
</button>
</div>
);
}
functionApp(){
return(
<ClerkProvider>
<SignedOut>
<SignInButton/>
</SignedOut>
<SignedIn>
<ClerkSignedInComponent/>
</SignedIn>
</ClerkProvider>
);
}
exportdefaultApp;

```

Copy
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/storage>)
Previous
    [← Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
Next
    [Permissions →](https://www.instantdb.com/docs/auth/</docs/permissions>)
## On this page
  1. ### [Setup](https://www.instantdb.com/docs/auth/</docs/auth/clerk#setup>)
  2. ### [Usage](https://www.instantdb.com/docs/auth/</docs/auth/clerk#usage>)




## Content from https://www.instantdb.com/docs/auth/google-oauth

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/auth/</pricing>)[Examples](https://www.instantdb.com/docs/auth/</examples>)[Essays](https://www.instantdb.com/docs/auth/</essays>)[Docs](https://www.instantdb.com/docs/auth/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/auth/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/auth/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/auth/</dash>)
[Sign up](https://www.instantdb.com/docs/auth/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Authentication and Permissions
# Google OAuth
Instant supports logging in your users with their Google account. We support flows for Web and React Native. Follow the steps below to get started.
**Step 1: Configure OAuth consent screen** Go to the [Google Console](https://www.instantdb.com/docs/auth/<https:/console.cloud.google.com/apis/credentials>).
Click "CONFIGURE CONSENT SCREEN." If you already have a consent screen, you can skip to the next step.
Select "External" and click "CREATE".
Add your app's name, a support email, and developer contact information. Click "Save and continue".
No need to add scopes or test users. Click "Save and continue" for the next screens. Until you reach the "Summary" screen, click "Back to dashboard".
**Step 2: Create an OAuth client for Google** From Google Console, click "+ CREATE CREDENTIALS"
Select "OAuth client ID"
Select "Web application" as the application type.
Add `https://api.instantdb.com/runtime/oauth/callback` as an Authorized redirect URI.
If you're testing from localhost, **add both`http://localhost`** and `http://localhost:3000` to "Authorized JavaScript origins", replacing `3000` with the port you use. For production, add your website's domain.
**Step 3: Register your OAuth client with Instant**
Go to the Instant dashboard and select the `Auth` tab for your app.
Register a Google client and enter the client id and client secret from the OAuth client that you created.
**Step 4: Register your website with Instant**
In the `Auth` tab, add the url of the websites where you are using Instant to the Redirect Origins. If you're testing from localhost, add `http://localhost:3000`, replacing `3000` with the port you use. For production, add your website's domain.
**Step 5: Add login to your app**
The next sections will show you how to use your configured OAuth client with Instant.
## Native Button (Web)
Use Google's pre-styled button to sign in. Using this method you can render your custom app name in the consent screen (Recommended)
## Redirect flow (Web)
Easier to integrate, but doesn't let you render your custom app name.
## React Native
Add Google OAuth to your RN app with our webflow integration.
## Native button for Web
You can use [Google's Sign in Button](https://www.instantdb.com/docs/auth/<https:/developers.google.com/identity/gsi/web/guides/overview>) with Instant. You'll use `db.auth.SignInWithIdToken` to authenticate your user. The benefit of using Google's button is that you can display your app's name in the consent screen.
First, make sure that your website is in the list of "Authorized JavaScript origins" for your Google client on the [Google console](https://www.instantdb.com/docs/auth/<https:/console.cloud.google.com/apis/credentials>).
If you're using React, the easiest way to include the signin button is through the `@react-oauth/google`[ package](https://www.instantdb.com/docs/auth/<https:/github.com/MomenSherif/react-oauth>).
```
npminstall @react-oauth/google

```

Include the button and use `db.auth.signInWithIdToken` to complete sign in. Here's a full example
```
'use client';
importReact,{ useState }from'react';
import{ init }from'@instantdb/react';
import{GoogleOAuthProvider,GoogleLogin}from'@react-oauth/google';
constAPP_ID="__APP_ID__";
const db =init({appId:APP_ID});
// e.g. 89602129-cuf0j.apps.googleusercontent.com
constGOOGLE_CLIENT_ID='REPLACE_ME';
// Use the google client name in the Instant dashboard auth tab
constGOOGLE_CLIENT_NAME='REPLACE_ME';
functionApp(){
const{ isLoading, user, error }= db.useAuth();
if(isLoading){
return<div>Loading...</div>;
}
if(error){
return<div>Uh oh!{error.message}</div>;
}
if(user){
return<h1>Hello{user.email}!</h1>;
}
return<Login/>;
}
functionLogin(){
const[nonce]=useState(crypto.randomUUID());
return(
<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
<GoogleLogin
    nonce={nonce}
    onError={()=>alert('Login failed')}
    onSuccess={({ credential })=>{
     db.auth
.signInWithIdToken({
clientName:GOOGLE_CLIENT_NAME,
idToken: credential,
// Make sure this is the same nonce you passed as a prop
// to the GoogleLogin button
       nonce,
})
.catch((err)=>{
alert('Uh oh: '+ err.body?.message);
});
}}
/>
</GoogleOAuthProvider>
);
}

```

Copy
If you're not using React or prefer to embed the button yourself, refer to [Google's docs on how to create the button and load their client library](https://www.instantdb.com/docs/auth/<https:/developers.google.com/identity/gsi/web/guides/overview>). When creating your button, make sure to set the `data-ux_mode="popup"`. Your `data-callback` function should look like:
```
asyncfunctionhandleSignInWithGoogle(response){
await db.auth.signInWithIdToken({
// Use the google client name in the Instant dashboard auth tab
clientName:'REPLACE_ME',
idToken: response.credential,
// make sure this is the same nonce you set in data-nonce
nonce:'REPLACE_ME',
});
}

```

Copy
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/storage>)
Previous
    [← Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
Next
    [Sign In with Apple →](https://www.instantdb.com/docs/auth/</docs/auth/apple>)


## Content from https://www.instantdb.com/docs/auth/magic-codes

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/auth/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/auth/</pricing>)[Examples](https://www.instantdb.com/docs/auth/</examples>)[Essays](https://www.instantdb.com/docs/auth/</essays>)[Docs](https://www.instantdb.com/docs/auth/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/auth/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/auth/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/auth/</dash>)
[Sign up](https://www.instantdb.com/docs/auth/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/auth/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/auth/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/auth/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/auth/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/auth/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/auth/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/auth/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/auth/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/auth/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/auth/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/auth/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/auth/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/auth/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/auth/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/auth/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/auth/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/auth/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Authentication and Permissions
# Magic Code Auth
Instant supports a "magic-code" flow for auth. Users provide their email, we send them a login code on your behalf, and they authenticate with your app. Here's how you can do it with react.
## Full Magic Code Example
The example below shows how to use magic codes in a React app. If you're looking for an example with vanilla JS, check out this [sandbox](https://www.instantdb.com/docs/auth/<https:/github.com/instantdb/instant/blob/main/client/sandbox/vanilla-js-vite/src/main.ts>).
```
'use client';
importReact,{ useState }from'react';
import{ init }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
const db =init({appId:APP_ID});
functionApp(){
const{ isLoading, user, error }= db.useAuth();
if(isLoading){
return<div>Loading...</div>;
}
if(error){
return<div>Uh oh!{error.message}</div>;
}
if(user){
return<h1>Hello{user.email}!</h1>;
}
return<Login/>;
}
functionLogin(){
const[sentEmail, setSentEmail]=useState('');
return(
<div style={authStyles.container}>
{!sentEmail ?(
<Email setSentEmail={setSentEmail}/>
):(
<MagicCode sentEmail={sentEmail}/>
)}
</div>
);
}
functionEmail({ setSentEmail }){
const[email, setEmail]=useState('');
consthandleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
if(!email)return;
setSentEmail(email);
  db.auth.sendMagicCode({ email }).catch((err)=>{
alert('Uh oh :'+ err.body?.message);
setSentEmail('');
});
};
return(
<form onSubmit={handleSubmit} style={authStyles.form}>
<h2 style={{color:'#333',marginBottom:'20px'}}>Let's log you in!</h2>
<div>
<input
     style={authStyles.input}
     placeholder="Enter your email"
     type="email"
     value={email}
     onChange={(e)=>setEmail(e.target.value)}
/>
</div>
<div>
<button type="submit" style={authStyles.button}>
SendCode
</button>
</div>
</form>
);
}
functionMagicCode({ sentEmail }){
const[code, setCode]=useState('');
consthandleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  db.auth.signInWithMagicCode({email: sentEmail, code }).catch((err)=>{
alert('Uh oh :'+ err.body?.message);
setCode('');
});
};
return(
<form onSubmit={handleSubmit} style={authStyles.form}>
<h2 style={{color:'#333',marginBottom:'20px'}}>
Okay, we sent you an email!What was the code?
</h2>
<div>
<input
     style={authStyles.input}
     type="text"
     placeholder="123456..."
     value={code}
     onChange={(e)=>setCode(e.target.value)}
/>
</div>
<button type="submit" style={authStyles.button}>
Verify
</button>
</form>
);
}
constauthStyles:Record<string,React.CSSProperties>={
container:{
display:'flex',
justifyContent:'center',
alignItems:'center',
height:'100vh',
},
form:{
display:'flex',
flexDirection:'column',
alignItems:'center',
justifyContent:'center',
height:'100vh',
fontFamily:'Arial, sans-serif',
},
input:{
padding:'10px',
marginBottom:'15px',
border:'1px solid #ddd',
borderRadius:'5px',
width:'300px',
},
button:{
padding:'10px 20px',
backgroundColor:'#007bff',
color:'white',
border:'none',
borderRadius:'5px',
cursor:'pointer',
},
};
exportdefaultApp;

```

Copy
This creates a `Login` component to handle our auth flow. Of note is `auth.sendMagicCode` and `auth.signInWithMagicCode`.
On successful validation, Instant's backend will return a user object with a refresh token. The client SDK will then restart the websocket connection with Instant's sync layer and provide the refresh token.
When doing `useQuery` or `transact`, the refresh token will be used to hydrate `auth` on the backend during permission checks.
On the client, `useAuth` will set `isLoading` to `false` and populate `user` -- huzzah!
## useAuth
```
functionApp(){
const{ isLoading, user, error }= db.useAuth();
if(isLoading){
return<div>Loading...</div>;
}
if(error){
return<div>Uh oh!{error.message}</div>;
}
if(user){
return<Main/>;
}
return<Login/>;
}

```

Use `useAuth` to fetch the current user. Here we guard against loading our `Main` component until a user is logged in
## Send a Magic Code
```
db.auth.sendMagicCode({ email }).catch((err)=>{
alert('Uh oh :'+ err.body?.message);
setState({...state,sentEmail:''});
});

```

Use `auth.sendMagicCode` to generate a magic code on instant's backend and email it to the user.
## Sign in with Magic Code
```
db.auth.signInWithMagicCode({email: sentEmail, code }).catch((err)=>{
alert('Uh oh :'+ err.body?.message);
setState({...state,code:''});
});

```

You can then use `auth.signInWithMagicCode` to authenticate the user with the magic code they provided.
## Sign out
```
db.auth.signOut();

```

Use `auth.signOut` from the client to invalidate the user's refresh token and sign them out.You can also use the admin SDK to sign out the user [from the server](https://www.instantdb.com/docs/auth/</docs/backend#sign-out>).
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/auth/<https:/instantdb.com/docs/storage>)
Previous
    [← Auth](https://www.instantdb.com/docs/auth/</docs/auth>)
Next
    [Google OAuth →](https://www.instantdb.com/docs/auth/</docs/auth/google-oauth>)
## On this page
  1. ### [Full Magic Code Example](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes#full-magic-code-example>)
  2. ### [useAuth](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes#use-auth>)
  3. ### [Send a Magic Code](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes#send-a-magic-code>)
  4. ### [Sign in with Magic Code](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes#sign-in-with-magic-code>)
  5. ### [Sign out](https://www.instantdb.com/docs/auth/</docs/auth/magic-codes#sign-out>)




## Content from https://www.instantdb.com/docs/backend

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Instant on the Backend
You can use Instant on the server as well! This can be especially useful for running scripts, custom auth flows, or sensitive application logic.
## Admin SDK
We currently offer a javascript library `@instantdb/admin` for using Instant in a non-browser context. This library is similar to our client SDK with a few tweaks.
### init
```
import{ init, id }from'@instantdb/admin';
const db =init({
appId:INSTANT_APP_ID,
adminToken: process.env.INSTANT_APP_ADMIN_TOKEN,
});

```

Similar to `@instantdb/react`, you must `init` before doing any queries or writes. Running `init` authenticates you against our admin API. In addition to providing your `appId`, you must also provide your `adminToken`.
Whereas exposing your `appId` in source control is fine, it's not safe to expose your admin token. Permission checks will not run for queries and writes from our admin API. Be sure to regenerate your token from your dashboard if it accidentally leaks.
## Reading and Writing Data
`query` and `transact` let you read and write data as an admin.
### query
```
const data =await db.query({goals:{},todos:{}});
const{ goals, todos }= data;

```

In react we export `useQuery` to enable "live queries", queries that will automatically update when data changes.
In the admin SDK we instead export an async `query` function that simply fires a query once and returns a result.
### transact
```
const res =await db.transact([
 db.tx.todos[id()].update({title:'Get fit'})
])
console.log("New todo entry made for with tx-id", res["tx-id"])

```

`transact` is an async function that behaves nearly identical to `transact` from `@instantdb/react`. It returns a `tx-id` on success.
## Schema
`init` also accepts a schema argument:
```
import{ init, id }from'@instantdb/admin';
import schema from'../instant.schema.ts';
const db =init({
 appId: process.env.INSTANT_APP_ID,
 adminToken: process.env.INSTANT_APP_ADMIN_TOKEN,
 schema,
});

```

If you add a schema, `db.query` and `db.transact` will come with autocompletion and typesafety out of the box. The backend will also use your schema to generate missing attributes.
To learn more about writing schemas, head on over to the [Modeling your data](https://www.instantdb.com/docs/</docs/modeling-data>) section.
## Impersonating users
When you use the admin SDK, you can make _any_ query or transaction. As an admin, you bypass permissions. But, sometimes you want to make queries on behalf of your users, and would like to respect permissions.
You can do this with the `db.asUser` function.
```
// Scope by their email
const scopedDb = db.asUser({email:'alyssa_p_hacker@instantdb.com'});
// Or with their auth token
const token = db.auth.createToken('alyssa_p_hacker@instantdb.com');
const scopedDb = db.asUser({ token });
// Or use the db as a guest!
const scopedDb = db.asUser({guest:true});
// Queries and transactions will run with those permissions
await scopedDb.query({logs:{}});

```

## Retrieve a user
As an admin, you can retrieve an app user record by `email`, `id`, or `refresh_token`. You can do this with the `db.auth.getUser` function.
```
const user =await db.auth.getUser({email:'alyssa_p_hacker@instantdb.com'});
const user =await db.auth.getUser({
id: userId,
});
const user =await db.auth.getUser({
refresh_token: userRefreshToken,
});

```

## Delete a user
You can also delete an app user record by `email`, `id`, or `refresh_token`. You can do this with the `db.auth.deleteUser` function.
```
const deletedUser =await db.auth.deleteUser({
email:'alyssa_p_hacker@instantdb.com',
});
const deletedUser =await db.auth.deleteUser({
id: userId,
});
const deletedUser =await db.auth.deleteUser({
refresh_token: userRefreshToken,
});

```

Note that this _only_ deletes the user record. It does not delete all user data. If you want to delete all of a user's data, you'll need to do it manually:
```
const{ goals, todos }=await db.query({
goals:{$:{where:{creator: userId }}},
todos:{$:{where:{creator: userId }}},
});
await db.transact([
...goals.map((item)=> db.tx.goals[item.id].delete()),
...todos.map((item)=> tx.todos[item.id].delete()),
]);
// Now we can delete the user
await db.auth.deleteUser({id: userId });

```

## Sign Out
The `db.auth.signOut` method allows you to log out a user by invalidating any tokens associated with their email. This can be useful when you want to forcibly log out a user from your application:
```
try{
await db.auth.signOut('alyssa_p_hacker@instantdb.com');
console.log('Successfully signed out');
}catch(err){
console.error('Sign out failed:', err.message);
}

```

## Custom Auth
You can use the Admin SDK to create your own authentication flows. To implement custom auth flows, you would make one change in your backend, and one change in your frontend. Here's how it would look:
### 1. Backend: db.auth.createToken
Create a new `sign-in` endpoint in your backend.
This endpoint will use `db.auth.createToken` to generate an authentication token for the user:
```
app.post('/sign-in',async(req, res)=>{
// your custom logic for signing users in
// ...
// on success, create and return a token
const token =await db.auth.createToken(email);
return res.status(200).send({ token });
});

```

If a user with this email does not exist, `auth.createToken` will create a user for you.
Right now we require that every user _must_ have an email. If you need to relax this constraint let us know.
### 2. Frontend: db.auth.signInWithToken
Once your frontend calls your `sign-in` endpoint, it can then use the generated token and sign a user in with `db.auth.signInWithToken`.
Here's a full example:
```
importReact,{ useState }from'react';
import{ init }from'@instantdb/react';
constAPP_ID="__APP_ID__";
const db =init({appId:APP_ID});
asyncfunctioncustomSignIn(
email: string,
password: string
):Promise<{token: string }>{
const response =awaitfetch('your-website.com/api/sign-in',{
method:'POST',
headers:{
'Content-Type':'application/json',
},
body:JSON.stringify({ email, password }),
});
const data =await response.json();
return data;
}
functionApp(){
const{ isLoading, user, error }= db.useAuth();
if(isLoading){
return<div>Loading...</div>;
}
if(error){
return<div>Uh oh!{error.message}</div>;
}
if(user){
return<div>Hello{user.email}!</div>;
}
return<Login/>;
}
functionLogin(){
const[email, setEmail]=useState('');
const[password, setPassword]=useState('');
consthandleEmailChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
setEmail(event.target.value);
};
consthandlePasswordChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
setPassword(event.target.value);
};
consthandleSignIn=async()=>{
const data =awaitcustomSignIn(email, password);// initiate your custom sign in flow
  db.auth.signInWithToken(data.token);// sign in with the token on success
};
return(
<div>
<input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={handleEmailChange}
/>
<input
    type="password"
    placeholder="Enter your password"
    value={password}
    onChange={handlePasswordChange}
/>
<button onClick={handleSignIn}>SignIn</button>
</div>
);
}

```

## Generating magic codes
We support a [magic code flow](https://www.instantdb.com/docs/</docs/auth>) out of the box. However, if you'd like to use your own email provider to send the code, you can do this with `db.auth.generateMagicCode` function:
```
app.post('/custom-send-magic-code',async(req, res)=>{
const{ code }=await db.auth.generateMagicCode(req.body.email);
// Now you can use your email provider to send magic codes
awaitsendMyCustomMagicCodeEmail(req.body.email, code);
return res.status(200).send({ token });
});

```

## Authenticated Endpoints
You can also use the admin SDK to authenticate users in your custom endpoints. This would have two steps:
### 1. Frontend: user.refresh_token
In your frontend, the `user` object has a `refresh_token` property. You can pass this token to your endpoint:
```
// client 
import{ init }from'@instantdb/react';
const db =init(/* ... */)
functionApp(){
const{ user }= db.useAuth();
// call your api with `user.refresh_token`
functiononClick(){
  myAPI.customEndpoint(user.refresh_token,...);
}
}

```

### 2. Backend: auth.verifyToken
You can then use `auth.verifyToken` to verify the `refresh_token` that was passed in.
```
app.post('/custom_endpoint',async(req, res)=>{
// verify the token this user passed in
const user =await db.auth.verifyToken(req.headers['token']);
if(!user){
return res.status(400).send('Uh oh, you are not authenticated');
}
// ...
});

```

If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Reading data](https://www.instantdb.com/docs/</docs/instaql>)
Next
    [Patterns →](https://www.instantdb.com/docs/</docs/patterns>)
## On this page
  1. ### [Admin SDK](https://www.instantdb.com/docs/</docs/backend#admin-sdk>)
    1. [init](https://www.instantdb.com/docs/</docs/backend#init>)
  2. ### [Reading and Writing Data](https://www.instantdb.com/docs/</docs/backend#reading-and-writing-data>)
    1. [query](https://www.instantdb.com/docs/</docs/backend#query>)
    2. [transact](https://www.instantdb.com/docs/</docs/backend#transact>)
  3. ### [Schema](https://www.instantdb.com/docs/</docs/backend#schema>)
  4. ### [Impersonating users](https://www.instantdb.com/docs/</docs/backend#impersonating-users>)
  5. ### [Retrieve a user](https://www.instantdb.com/docs/</docs/backend#retrieve-a-user>)
  6. ### [Delete a user](https://www.instantdb.com/docs/</docs/backend#delete-a-user>)
  7. ### [Sign Out](https://www.instantdb.com/docs/</docs/backend#sign-out>)
  8. ### [Custom Auth](https://www.instantdb.com/docs/</docs/backend#custom-auth>)
    1. [1. Backend: db.auth.createToken](https://www.instantdb.com/docs/</docs/backend#1-backend-db-auth-create-token>)
    2. [2. Frontend: db.auth.signInWithToken](https://www.instantdb.com/docs/</docs/backend#2-frontend-db-auth-sign-in-with-token>)
  9. ### [Generating magic codes](https://www.instantdb.com/docs/</docs/backend#generating-magic-codes>)
  10. ### [Authenticated Endpoints](https://www.instantdb.com/docs/</docs/backend#authenticated-endpoints>)
    1. [1. Frontend: user.refresh_token](https://www.instantdb.com/docs/</docs/backend#1-frontend-user-refresh-token>)
    2. [2. Backend: auth.verifyToken](https://www.instantdb.com/docs/</docs/backend#2-backend-auth-verify-token>)




## Content from https://www.instantdb.com/docs/cli

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Platform features
# Instant CLI
The Instant CLI was designed to drive your Instant application entirely from a project's codebase. You can create apps, define your data model, and update your permissions, **all through your terminal**.
## Init
To get started, head on over to your project's root repository, and write:
```
npx instant-cli@latest init

```

Copy
This will guide you through picking an Instant app and generate two files for you:
  * `instant.schema.ts` defines your application's data model.
  * `instant.perms.ts` defines your permission rules.


To learn how to change `instant.schema.ts`, check our [Modeling Data](https://www.instantdb.com/docs/</docs/modeling-data>). For `instant.perms.ts`, check out the [permissions](https://www.instantdb.com/docs/</docs/permissions>) page.
## Push
When you're ready to publish your changes to `instant.schema.ts`, run:
```
npx instant-cli@latest push schema

```

Copy
This will evaluate your schema, compare it with production, and migrate your data model.
`push schema` doesn't support _renaming_ or _deleting_ attributes yet. To do this, use the [Explorer](https://www.instantdb.com/docs/</docs/modeling-data#update-or-delete-attributes>)
Similarily, when you change `instant.perms.ts`, you can run:
```
npx instant-cli push perms

```

Copy
## Pull
Sometimes, you change your schema or rules from your Explorer. If you want to `pull` the latest version of schema and perms for production, write:
```
npx instant-cli@latest pull

```

Copy
This will generate new `instant.schema.ts` and `instant.perms.ts` files, based on your production state.
## App ID
Whenever you run a CLI command, we look up your app id. You can either provide an app id as an option:
```
 npx instant-cli@latest init --app $MY_APP_ID

```

Or store it in your `.env` file:
```
INSTANT_APP_ID=*****

```

As a convenience, apart from `INSTANT_APP_ID`, we also check for:
  * `NEXT_PUBLIC_INSTANT_APP_ID` for next apps,
  * `PUBLIC_INSTANT_APP_ID` for svelte apps,
  * `VITE_INSTANT_APP_ID` for vite apps
  * `NUXT_PUBLIC_INSTANT_APP_ID` for nuxt apps
  * `EXPO_PUBLIC_INSTANT_APP_ID` for expo apps


## Authenticating in CI
In CI or similer environments, you may want to handle authentication without having to go through a web-based validation step each time.
In these cases, you can provide a `INSTANT_CLI_AUTH_TOKEN` environment variable.
To obtain a token for later use, run:
```
npx instant-cli@latest login -p

```

Copy
Instead of saving the token to your local device, the CLI will print it to your console. You can copy this token and provide it as `INSTANT_CLI_AUTH_TOKEN` later in your CI tool.
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
Next
    [Custom emails →](https://www.instantdb.com/docs/</docs/emails>)
## On this page
  1. ### [Init](https://www.instantdb.com/docs/</docs/cli#init>)
  2. ### [Push](https://www.instantdb.com/docs/</docs/cli#push>)
  3. ### [Pull](https://www.instantdb.com/docs/</docs/cli#pull>)
  4. ### [App ID](https://www.instantdb.com/docs/</docs/cli#app-id>)
  5. ### [Authenticating in CI](https://www.instantdb.com/docs/</docs/cli#authenticating-in-ci>)




## Content from https://www.instantdb.com/docs/emails

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Platform features
# Custom email templates and senders
You can customize all aspects of your Instant app's "magic code" email: the body (plain text or HTML), subject, sender name, and even the `from` address.
## Dashboard
To start, go to your Dashboard's [auth tab](https://www.instantdb.com/docs/<https:/instantdb.com/dash?s=main&t=auth>). Click "Custom Magic Code Email", and you're ready to go.
### Variables
We provide a handful of variables you can use in both your subject line and body template:
  * `{code}`, the magic code, e.g. _123456_. Note, this variable is required in both the subject and body.
  * `{user_email}`, the recipient user's email address, e.g. _happyuser@gmail.com_
  * `{app_title}` , your app's name


Using a variable is as easy as adding the variable's name in curly brackets, e.g. `{variable_name}`.
```
<p>Hi {user_email}, here's your code for {app_title}:</p>
<strong>{code}</strong>

```

## Custom sender addresses
You can also set Instant's email's `from` and `reply-to` fields to an address on your own domain.
If you provide a custom sender address, you'll need to confirm it before we can start delivering from it.
Our email partner, Postmark, will send a confirmation to the provided address with a link to verify. Until the address is verified, emails will continue to be sent from Instant's default auth sender (`auth@pm.instantdb.com`).
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
Next
    [App teams →](https://www.instantdb.com/docs/</docs/teams>)
## On this page
  1. ### [Dashboard](https://www.instantdb.com/docs/</docs/emails#dashboard>)
    1. [Variables](https://www.instantdb.com/docs/</docs/emails#variables>)
  2. ### [Custom sender addresses](https://www.instantdb.com/docs/</docs/emails#custom-sender-addresses>)




## Content from https://www.instantdb.com/docs/init

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Initializing Instant
The first step to using Instant in your app is to call `init` before rendering your component tree.
```
import{ init }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID='__APP_ID__';
const db =init({appId:APP_ID});
functionApp(){
return<Main/>;
}

```

With that, you can use `db` to [write data](https://www.instantdb.com/docs/</docs/instaml>), [make queries](https://www.instantdb.com/docs/</docs/instaql>), [handle auth](https://www.instantdb.com/docs/</docs/auth>), and more!
## Typesafety
If you're using typescript, `init` accepts a `schema` argument. Adding a schema provides auto-completion and typesafety for your queries and transactions.
```
import{ init, i }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID='__APP_ID__';
const schema = i.schema({
 entities:{
  todos: i.entity({
   text: i.string(),
   done: i.boolean(),
   createdAt: i.number(),
}),
},
});
const db =init({ appId:APP_ID, schema });

```

To learn more about writing schemas, head on over to the [Modeling your data](https://www.instantdb.com/docs/</docs/modeling-data>) section.
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Getting started w/ React](https://www.instantdb.com/docs/</docs>)
Next
    [Modeling data →](https://www.instantdb.com/docs/</docs/modeling-data>)
## On this page
  1. ### [Typesafety](https://www.instantdb.com/docs/</docs/init#typesafety>)




## Content from https://www.instantdb.com/docs/instaml

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Writing data
Instant uses a **Firebase-inspired** interface for mutations. We call our mutation language **InstaML**
## Update data
We use the `update` action to create entities.
```
import{ init }from'@instantdb/react';
const db =init({
 appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
});
// transact! 🔥
db.transact(db.tx.goals[id()].update({ title:'eat'}));

```

This creates a new `goal` with the following properties:
  * It's identified by a randomly generated id via the `id()` function.
  * It has an attribute `title` with value `eat`.


Similar to NoSQL, you don't need to use the same schema for each entity in a namespace. After creating the previous goal you can run the following:
```
db.transact(
 db.tx.goals[id()].update({
priority:'none',
isSecret:true,
value:10,
aList:[1,2,3],
anObject:{foo:'bar'},
}),
);

```

You can store `strings`, `numbers`, `booleans`, `arrays`, and `objects` as values. You can also generate values via functions. Below is an example for picking a random goal title.
```
db.transact(
 db.tx.goals[id()].update({
title:['eat','sleep','hack','repeat'][Math.floor(Math.random()*4)],
}),
);

```

The `update` action is also used for updating entities. Suppose we had created the following goal
```
const eatId =id();
db.transact(
 db.tx.goals[eatId].update({priority:'top',lastTimeEaten:'Yesterday'}),
);

```

We eat some food and decide to update the goal. We can do that like so:
```
db.transact(db.tx.goals[eatId].update({lastTimeEaten:'Today'}));

```

This will only update the value of the `lastTimeEaten` attribute for entity `eat`.
## Merge data
When you `update` an attribute, you overwrite it. This is fine for updating values of strings, numbers, and booleans. But if you use `update` to overwrite json objects you may encounter two problems:
  1. You lose any data you didn't specify.
  2. You risk clobbering over changes made by other clients.


For example, imagine we had a `game` entity, that stored a `state` of favorite colors:
```
// User 1 saves {'0-0': 'red'}
db.transact(db.tx.games[gameId].update({state:{'0-0':'red'}}));
// User 2 saves {'0-1': 'blue'}
db.transact(db.tx.games[gameId].update({state:{'0-1':'blue'}}));
// 🤔 Uh oh! User 2 overwrite User 1:
// Final State: {'0-1': 'blue' }

```

To make working with deeply-nested, document-style JSON values a breeze, we created `merge`. Similar to [lodash's `merge` function](https://www.instantdb.com/docs/<https:/lodash.com/docs/4.17.15#merge>), `merge` allows you to specify the slice of data you want to update:
```
// User 1 saves {'0-0': 'red'}
db.transact(db.tx.games[gameId].merge({state:{'0-0':'red'}}));
// User 2 saves {'0-1': 'blue'}
db.transact(db.tx.games[gameId].merge({state:{'0-1':'blue'}}));
// ✅ Wohoo! Both states are merged!
// Final State: {'0-0': 'red', '0-0': 'blue' }

```

`merge` only merges objects. Calling `merge` on **arrays, numbers, or booleans** will overwrite the values.
Sometimes you may want to remove keys from a nested object. You can do so by calling `merge` with a key set to `null` or `undefined`. This will remove the corresponding property from the object.
```
// State: {'0-0': 'red', '0-0': 'blue' }
db.transact(db.tx.games[gameId].merge({state:{'0-1':null}}));
// New State! {'0-0': 'red' }

```

## Delete data
The `delete` action is used for deleting entities.
```
db.transact(db.tx.goals[eatId].delete());

```

You can generate an array of `delete` txs to delete all entities in a namespace
```
const{ isLoading, error, data }= db.useQuery({goals:{}});
const{ goals }= data;
// ...
db.transact(goals.map((g)=> db.tx.goals[g.id].delete()));

```

Calling `delete` on an entity also deletes its associations. So no need to worry about cleaning up previously created links.
## Link data
`link` is used to create associations.
Suppose we create a `goal` and a `todo`.
```
db.transact([
 db.tx.todos[workoutId].update({title:'Go on a run'}),
 db.tx.goals[healthId].update({title:'Get fit!'}),
]);

```

We can associate `healthId` with `workoutId` like so:
```
db.transact(tx.goals[healthId].link({todos: workoutId }));

```

We could have done all this in one `transact` too via chaining transaction chunks.
```
db.transact([
 tx.todos[workoutId].update({title:'Go on a run'}),
 tx.goals[healthId].update({title:'Get fit!'}).link({todos: workoutId }),
]);

```

You can specify multiple ids in one `link` as well:
```
db.transact([
 db.tx.todos[workoutId].update({title:'Go on a run'}),
 db.tx.todos[proteinId].update({title:'Drink protein'}),
 db.tx.todos[sleepId].update({title:'Go to bed early'}),
 db.tx.goals[healthId]
.update({title:'Get fit!'})
.link({todos:[workoutId, proteinId, sleepId]}),
]);

```

Links are bi-directional. Say we link `healthId` to `workoutId`
```
db.transact(tx.goals[healthId].link({todos: workoutId }));

```

We can query associations in both directions
```
const{ isLoading, error, data }= db.useQuery({
goals:{todos:{}},
todos:{goals:{}},
});
const{ goals, todos }= data;
console.log('goals with nested todos', goals);
console.log('todos with nested goals', todos);

```

## Unlink data
Links can be removed via `unlink.`
```
db.transact(tx.goals[healthId].unlink({todos: workoutId }));

```

This removes links in both directions. Unlinking can be done in either direction so unlinking `workoutId` from `healthId` would have the same effect.
```
db.transact([db.tx.todos[workoutId].unlink({goals: healthId })]);

```

We can `unlink` multiple ids too:
```
db.transact([
 tx.goals[healthId].unlink({todos:[workoutId, proteinId, sleepId]}),
 tx.goals[workId].unlink({todos:[standupId, reviewPRsId, focusId]}),
]);

```

## Lookup by unique attribute
If your entity has a unique attribute, you can use `lookup` in place of the id to perform updates.
```
import{ lookup }from'@instantdb/react';
db.transact(
 db.tx.profiles[lookup('email','eva_lu_ator@instantdb.com')].update({
name:'Eva Lu Ator',
}),
);

```

The `lookup` function takes the attribute as its first argument and the unique attribute value as its second argument.
When it is used in a transaction, the updates will be applied to the entity that has the unique value. If no entity has the value, then a new entity with a random id will be created with the value.
It can be used with `update`, `delete`, `merge`, `link`, and `unlink`.
When used with links, it can also be used in place of the linked entity's id.
```
db.transact(
 tx.users[lookup('email','eva_lu_ator@instantdb.com')].link({
posts:lookup('number',15),
}),
);

```

## Typesafety
By default, `db.transact` is permissive. When you save data, we'll create missing attributes for you:
```
db.tx.todos[workoutId].update({
// Instant will automatically create this attribute
 dueDate: Date.now()+60*1000,
});

```

As your app grows, you may want to start enforcing types. When you're ready, you can start using a [schema](https://www.instantdb.com/docs/</docs/modeling-data>):
```
import{ init }from'@instantdb/react';
import schema from'../instant.schema.ts';
const db =init({
 appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
 schema,
});

```

If your schema includes a `todos.dueDate` for example:
```
// instant.schema.ts
const _schema = i.schema({
 entities:{
  todos: i.entity({
// ...
   dueDate: i.date(),
}),
},
// ...
});
// ...

```

Instant will enforce that `todos.dueDate` are actually dates, and you'll get some nice intellisense to boot:
![](https://www.instantdb.com/img/docs/instaml-due-date.png)
Instant also comes with a few utility types, which can help you write abstractions over `transact`. For example, say you wanted to write a custom `update` function:
```
// Goal
myCustomUpdate('todos',{ dueDate: Date.now()});

```

You can use the `UpdateParams` utility to make sure arguments follow the schema:
```
import{ UpdateParams }from'@instantdb/react';
import{ AppSchema }from'../instant.schema.ts';
typeEntityTypes=keyof AppSchema['entities'];
functionmyCustomUpdate<EType extends EntityTypes>(
 etype: EType,
 args: UpdateParams<AppSchema, EType>,
){
// ..
}

```

And the `LinkParams` utility do the same for links:
```
import{ LinkParams }from'@instantdb/react';
import{ AppSchema }from'../instant.schema.ts';
typeEntityTypes=keyof AppSchema['entities'];
functionmyCustomLink<EType extends EntityTypes>(
 etype: EType,
 args: LinkParams<AppSchema, EType>,
){
// ..
}

```

To learn more about writing schemas, check out the [Modeling Data](https://www.instantdb.com/docs/</docs/modeling-data>) section.
## Batching transactions
If you have a large number of transactions to commit, you'll want to batch them to avoid hitting transaction limits and time outs.
Suppose we want to create 3000 goals. Here's how we can batch them into 30 transactions of 100 goals each.
```
const batchSize =100;// doing 100 txs should be pretty safe
constcreateGoals=async(total)=>{
let goals =[];
const batches =[];
// iterate through all your goals and create batches
for(let i =0; i < total; i++){
const goalNumber = i +1;
  goals.push(
   db.tx.goals[id()].update({ goalNumber,title:`Goal ${goalNumber}`}),
);
// We have enough goals to create a batch
if(goals.length>= batchSize){
   batches.push(goals);
   goals =[];// reset goals for the next batch
}
}
// Add any remaining goals to the last batch
if(goals.length){
  batches.push(goals);
}
// Now that you have your batches, transact them
for(const batch of batches){
await db.transact(batch);
}
};

```

## Using the tx proxy object
`db.tx` is a [proxy object](https://www.instantdb.com/docs/<https:/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy>) which creates transaction chunks to be committed via `db.transact`. It follows the format
```
db.tx.NAMESPACE_LABEL[ENTITY_IDENTIFIER].ACTION(ACTION_SPECIFIC_DATA)

```

  * `NAMESPACE_LABEL` refers to the namespace to commit (e.g. `goals`, `todos`)
  * `ENTITY_IDENTIFIER` is the id to look up in the namespace. This id must be a uuid and unique to the namespace. You can use the `id()` function to generate a uuid for convenience.
  * `ACTION` is one of `update`, `delete`, `link`, `unlink`
  * `ACTION_SPECIFIC_DATA` depends on the action
    * `update` takes in an object of information to commit
    * `delete` is the only action that doesn't take in any data,
    * `link` and `unlink` takes an object of label-entity pairs to create/delete associations


If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
Next
    [Reading data →](https://www.instantdb.com/docs/</docs/instaql>)
## On this page
  1. ### [Update data](https://www.instantdb.com/docs/</docs/instaml#update-data>)
  2. ### [Merge data](https://www.instantdb.com/docs/</docs/instaml#merge-data>)
  3. ### [Delete data](https://www.instantdb.com/docs/</docs/instaml#delete-data>)
  4. ### [Link data](https://www.instantdb.com/docs/</docs/instaml#link-data>)
  5. ### [Unlink data](https://www.instantdb.com/docs/</docs/instaml#unlink-data>)
  6. ### [Lookup by unique attribute](https://www.instantdb.com/docs/</docs/instaml#lookup-by-unique-attribute>)
  7. ### [Typesafety](https://www.instantdb.com/docs/</docs/instaml#typesafety>)
  8. ### [Batching transactions](https://www.instantdb.com/docs/</docs/instaml#batching-transactions>)
  9. ### [Using the tx proxy object](https://www.instantdb.com/docs/</docs/instaml#using-the-tx-proxy-object>)




## Content from https://www.instantdb.com/docs/instaql

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Reading data
Instant uses a declarative syntax for querying. It's like GraphQL without the configuration. Here's how you can query data with **InstaQL.**
## Fetch namespace
One of the simplest queries you can write is to simply get all entities of a namespace.
```
import{ init }from'@instantdb/react';
const db =init({
appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
});
functionApp(){
// Queries! 🚀
const query ={goals:{}};
const{ isLoading, error, data }= db.useQuery(query);
// ...
}

```

Inspecting `data`, we'll see:
```
console.log(data)
{
"goals":[
{
"id": healthId,
"title":"Get fit!"
},
{
"id": workId,
"title":"Get promoted!"
}
]
}

```

For comparison, the SQL equivalent of this would be something like:
```
const data ={goals:doSQL('SELECT * FROM goals')};

```

## Fetch multiple namespaces
You can fetch multiple namespaces at once:
```
const query ={goals:{},todos:{}};
const{ isLoading, error, data }= db.useQuery(query);

```

We will now see data for both namespaces.
```
console.log(data)
{
"goals":[...],
"todos":[
{
"id": focusId,
"title":"Code a bunch"
},
{
"id": proteinId,
"title":"Drink protein"
},
...
]
}

```

The equivalent of this in SQL would be to write two separate queries.
```
const data ={
goals:doSQL('SELECT * from goals'),
todos:doSQL('SELECT * from todos'),
};

```

## Fetch a specific entity
If you want to filter entities, you can use the `where` keyword. Here we fetch a specific goal
```
const query ={
goals:{
$:{
where:{
id: healthId,
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"goals":[
{
"id": healthId,
"title":"Get fit!"
}
]
}

```

The SQL equivalent would be:
```
const data ={goals:doSQL("SELECT * FROM goals WHERE id = 'healthId'")};

```

## Fetch associations
We can fetch goals and their related todos.
```
const query ={
goals:{
todos:{},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

`goals` would now include nested `todos`
```
console.log(data)
{
"goals":[
{
"id": healthId,
"title":"Get fit!",
"todos":[...],
},
{
"id": workId,
"title":"Get promoted!",
"todos":[...],
}
]
}

```

### Comparing with SQL
The SQL equivalent for this would be something along the lines of:
```
const query =`
 SELECT g.*, gt.todos
 FROM goals g
 JOIN (
   SELECT g.id, json_agg(t.*) as todos
   FROM goals g
   LEFT JOIN todos t on g.id = t.goal_id
   GROUP BY 1
 ) gt on g.id = gt.id
`;
const data ={goals:doSQL(query)};

```

Notice the complexity of this SQL query. Although fetching associations in SQL is straightforward via `JOIN`, marshalling the results in a nested structure via SQL is tricky. An alternative approach would be to write two straight-forward queries and then marshall the data on the client.
```
const _goals =doSQL("SELECT * from goals")
const _todos =doSQL("SELECT * from todos")
const data ={goals: _goals.map(g=>(
return{...g,todos: _todos.filter(t=> t.goal_id=== g.id)}
))

```

Now compare these two approaches with `InstaQL`
```
const query ={
goals:{
todos:{},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

Modern applications often need to render nested relations, `InstaQL` really starts to shine for these use cases.
## Fetch specific associations
### A) Fetch associations for filtered namespace
We can fetch a specific entity in a namespace as well as it's related associations.
```
const query ={
goals:{
$:{
where:{
id: healthId,
},
},
todos:{},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

Which returns
```
console.log(data)
{
"goals":[
{
"id": healthId,
"title":"Get fit!",
"todos":[
{
"id": proteinId,
"title":"Drink protein"
},
{
"id": sleepId,
"title":"Go to bed early"
},
{
"id": workoutId,
"title":"Go on a run"
}
]
}
]
}

```

### B) Filter namespace by associated values
We can filter namespaces **by their associations**
```
const query ={
goals:{
$:{
where:{
'todos.title':'Code a bunch',
},
},
todos:{},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

Returns
```
console.log(data)
{
"goals":[
{
"id": workId,
"title":"Get promoted!",
"todos":[
{
"id": focusId,
"title":"Code a bunch"
},
{
"id": reviewPRsId,
"title":"Review PRs"
},
{
"id": standupId,
"title":"Do standup"
}
]
}
]
}

```

### C) Filter associations
We can also filter associated data.
```
const query ={
goals:{
todos:{
$:{
where:{
'todos.title':'Go on a run',
},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

This will return goals and filtered todos
```
console.log(data)
{
"goals":[
{
"id": healthId,
"title":"Get fit!",
"todos":[
{
"id": workoutId,
"title":"Go on a run"
}
]
},
{
"id": workId,
"title":"Get promoted!",
"todos":[]
}
]
}

```

Notice the difference between these three cases.
  * A) Fetched all todos for goal with id `health`
  * B) Filtered goals with a least one todo titled `Code a bunch`
  * C) Fetched all goals and filtered associated todos by title `Go on a run`


## Inverse Associations
Associations are also available in the reverse order.
```
const query ={
todos:{
goals:{},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"todos":[
{
"id": focusId,
"title":"Code a bunch",
"goals":[
{
"id": workId,
"title":"Get promoted!"
}
]
},
...,
]
}

```

## Pagination
You can limit the number of items from a top level namespace by adding a `limit` to the option map:
```
const query ={
todos:{
// limit is only supported for top-level namespaces right now
// and not for nested namespaces.
$:{limit:10},
},
};
const{ isLoading, error, data, pageInfo }= db.useQuery(query);

```

Instant supports both offset-based and cursor-based pagination for top-level namespaces.
### Offset
To get the next page, you can use an offset:
```
const query ={
todos:{
$:{
limit:10,
// similar to `limit`, `offset` is only supported for top-level namespaces
offset:10,
},
},
};
const{ isLoading, error, data, pageInfo }= db.useQuery(query);

```

In a React application, your offset-based pagination code might look something like this:
```
const[pageNumber, setPageNumber]=React.useState(1);
const pageSize =10;
const query ={
todos:{
$:{
limit: pageSize,
offset: pageSize *(pageNumber -1),
},
},
};
const{ isLoading, error, data }= db.useQuery(query);
// Load the next page by increasing the page number, which will
// increase the offset by the page size.
constloadNextPage=()=>{
setPageNumber(pageNumber +1);
};
// Load the previous page by decreasing the page number, which will
// decrease the offset by the page size.
constloadPreviousPage=()=>{
setPageNumber(pageNumber -1);
};

```

### Cursors
You can also get the next page with the `endCursor` returned in the `pageInfo` map from the previous result:
```
const query ={
todos:{
$:{
// These also are only supported for top-level namespaces
first:10,
after: pageInfo?.todos?.endCursor,
},
},
};

```

To get the previous page, use the `startCursor` in the `before` field of the option map and ask for the `last` items:
```
const query ={
todos:{
$:{
last:10,
before: pageInfo?.todos?.startCursor,
},
},
};

```

In a React application, your cursor-based pagination code might look something like this:
```
const pageSize =10;
const[cursors, setCursors]=React.useState({first: pageSize });
const query ={
todos:{
$:{
...cursors,
},
},
};
const{ isLoading, error, data, pageInfo }= db.useQuery(query);
constloadNextPage=()=>{
const endCursor = pageInfo?.todos?.endCursor;
if(endCursor){
setCursors({after: endCursor,first: pageSize });
}
};
constloadPreviousPage=()=>{
const startCursor = pageInfo?.todos?.startCursor;
if(startCursor){
setCursors({
before: startCursor,
// Ask for the `last` 10 items so that we get the items just
// before our startCursor
last: pageSize,
});
}
};

```

### Ordering
The default ordering is by the time the objects were created, in ascending order. You can change the order with the `order` key in the option map for top-level namespaces:
```
const query ={
todos:{
$:{
limit:10,
// Similar to limit, order is limited to top-level namespaces right now
order:{
serverCreatedAt:'desc',
},
},
},
};

```

The `serverCreatedAt` field is a reserved key that orders by the time that the object was first persisted on the Instant backend. It can take the value 'asc' (the default) or 'desc'.
You can also order by any attribute that is indexed and has a checked type.
Add indexes and checked types to your attributes from the [Explorer on the Instant dashboard](https://www.instantdb.com/docs/</dash?t=explorer>) or from the [cli with Schema-as-code](https://www.instantdb.com/docs/</docs/schema>).
```
// Get the todos that are due next
const query ={
todos:{
$:{
limit:10,
where:{
dueDate:{$gt:Date.now()},
},
order:{
dueDate:'asc',
},
},
},
};

```

## Advanced filtering
### And
The `where` clause supports multiple keys which will filter entities that match all of the conditions.
You can also provide a list of queries under the `and` key.
**Multiple keys in a single where** :
```
const query ={
todos:{
$:{
where:{
completed:true,
'goals.title':'Get promoted!',
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"todos":[
{
"id": focusId,
"title":"Code a bunch",
"completed":true
}
]
}

```

**`and`key:**
The `and` key is useful when you want an entity to match multiple conditions. In this case we want to find goals that have both `Drink protein` and `Go on a run` todos.:
```
const query ={
goals:{
$:{
where:{
and:[
{'todos.title':'Drink protein'},
{'todos.title':'Go on a run'},
],
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"goals":[
{
"id": healthId,
"title":"Get fit!"
}
]
}

```

### OR
The `where` clause supports `or` queries that will filter entities that match any of the clauses in the provided list:
```
const query ={
todos:{
$:{
where:{
or:[{title:'Code a bunch'},{title:'Review PRs'}],
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data);
{
"todos":[
{
"id": focusId,
"title":"Code a bunch"
},
{
"id": reviewPRsId,
"title":"Review PRs"
},
]
}

```

### $in
The `where` clause supports `$in` queries that will filter entities that match any of the items in the provided list. You can think of this as a shorthand for `or` on a single key.
```
const query ={
todos:{
$:{
where:{
title:{ $in:['Code a bunch','Review PRs']},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"todos":[
{
"id": focusId,
"title":"Code a bunch"
},
{
"id": reviewPRsId,
"title":"Review PRs"
}
]
}

```

### Comparison operators
The `where` clause supports comparison operators on fields that are indexed and have checked types.
Add indexes and checked types to your attributes from the [Explorer on the Instant dashboard](https://www.instantdb.com/docs/</dash?t=explorer>) or from the [cli with Schema-as-code](https://www.instantdb.com/docs/</docs/modeling-data>).
Operator| Description| JS equivalent  
---|---|---  
`$gt`| greater than| `>`  
`$lt`| less than| `<`  
`$gte`| greater than or equal to| `>=`  
`$lte`| less than or equal to| `<=`  
```
const query ={
todos:{
$:{
where:{
timeEstimateHours:{$gt:24},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data);
{
"todos":[
{
"id": buildShipId,
"title":"Build a starship prototype",
"timeEstimateHours":5000
}
]
}

```

Dates can be stored as timestamps (milliseconds since the epoch, e.g. `Date.now()`) or as ISO 8601 strings (e.g. `JSON.stringify(new Date())`) and can be queried in the same formats:
```
const now ='2024-11-26T15:25:00.054Z';
const query ={
todos:{
$:{where:{dueDate:{$lte: now }}},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data);
{
"todos":[
{
"id": slsFlightId,
"title":"Space Launch System maiden flight",
"dueDate":"2017-01-01T00:00:00Z"
}
]
}

```

If you try to use comparison operators on data that isn't indexed and type-checked, you'll get an error:
```
const query ={
todos:{
$:{where:{priority:{$gt:2}}},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(error);
{
"message":"Validation failed for query",
"hint":{
"data-type":"query",
"errors":[
{
"expected?":"indexed?",
"in":["priority","$","where","priority"],
"message":"The `todos.priority` attribute must be indexed to use comparison operators."
}
],
"input":{
"todos":{
"$":{
"where":{
"priority":{
"$gt":2
}
}
}
}
}
}
}

```

### $not
The `where` clause supports `$not` queries that will return entities that don't match the provided value for the field, including entities where the field is null or undefined.
```
const query ={
todos:{
$:{
where:{
location:{$not:'work'},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"todos":[
{
"id": cookId,
"title":"Cook dinner",
"location":"home"
},
{
"id": readId,
"title":"Read",
"location":null
},
{
"id": napId,
"title":"Take a nap"
}
]
}

```

### $isNull
The `where` clause supports `$isNull` queries that will filters entities by whether the field value is either null or undefined.
Set `$isNull` to `true` to return entities where where the field is null or undefined.
Set `$isNull` to `false` to return entities where the field is not null and not undefined.
```
const query ={
todos:{
$:{
where:{
location:{$isNull:false},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"todos":[
{
"id": cookId,
"title":"Cook dinner",
"location":"home"
}
]
}

```

```
const query ={
todos:{
$:{
where:{
location:{$isNull:true},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"todos":[
{
"id": readId,
"title":"Read",
"location":null
},
{
"id": napId,
"title":"Take a nap"
}
]
}

```

### $like
The `where` clause supports `$like` on fields that are indexed with a checked `string` type.
`$like` queries will return entities that match a **case sensitive** substring of the provided value for the field.
For **case insensitive** matching use `$ilike` in place of `$like`.
Here's how you can do queries like `startsWith`, `endsWith` and `includes`.
Example| Description| JS equivalent  
---|---|---  
`{ $like: "Get%" }`| Starts with 'Get'| `startsWith`  
`{ $like: "%promoted!" }`| Ends with 'promoted!'| `endsWith`  
`{ $like: "%fit%" }`| Contains 'fit'| `includes`  
Here's how you can use `$like` to find all goals that end with the word "promoted!"
```
// Find all goals that end with the word "promoted!"
const query ={
goals:{
$:{
where:{
title:{$like:'%promoted!'},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"goals":[
{
"id": workId,
"title":"Get promoted!",
}
]
}

```

You can use `$like` in nested queries as well
```
// Find goals that have todos with the word "standup" in their title
const query ={
goals:{
$:{
where:{
'todos.title':{$like:'%standup%'},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

Returns
```
console.log(data)
{
"goals":[
{
"id": standupId,
"title":"Perform standup!",
}
]
}

```

Case-insensitive matching with `$ilike`:
```
const query ={
goals:{
$:{
where:{
'todos.title':{$ilike:'%stand%'},
},
},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

```
console.log(data)
{
"goals":[
{
"id": standupId,
"title":"Perform standup!",
},
{
"id": standId,
"title":"Stand up a food truck.",
}
]
}

```

## Typesafety
By default, `db.useQuery` is permissive. You don't have to tell us your schema upfront, and you can write any kind of query:
```
const query ={
 goals:{
  todos:{},
},
};
const{ isLoading, error, data }= db.useQuery(query);

```

As your app grows, you may want to start enforcing types. When you're ready you can write a [schema](https://www.instantdb.com/docs/</docs/modeling-data>):
```
import{ init }from'@instantdb/react';
import schema from'../instant.schema.ts';
const db =init({
 appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
 schema,
});

```

If your schema includes `goals` and `todos` for example:
```
// instant.schema.ts
import{ i }from'@instantdb/core';
const _schema = i.schema({
 entities:{
  goals: i.entity({
   title: i.string(),
}),
  todos: i.entity({
   title: i.string(),
   dueDate: i.date(),
}),
},
 links:{
  goalsTodos:{
   forward:{ on:'todos', has:'many', label:'goals'},
   reverse:{ on:'goals', has:'many', label:'todos'},
},
},
});
// This helps Typescript display better intellisense
type_AppSchema=typeof _schema;
interfaceAppSchemaextends_AppSchema{}
const schema: AppSchema = _schema;
exporttype{ AppSchema };
exportdefault schema;

```

### Intellisense
Instant will start giving you intellisense for your queries. For example, if you're querying for goals, you'll see that only `todos` can be associated:
![](https://www.instantdb.com/img/docs/instaql-todos-goals-autocomplete.png)
And if you hover over `data`, you'll see the actual typed output of your query:
![](https://www.instantdb.com/img/docs/instaql-data-intellisense.png)
### Utility Types
Instant also comes with some utility types to help you use your schema in TypeScript.
For example, you could define your `query` upfront:
```
import{ InstaQLParams }from'@instantdb/react';
import{ AppSchema }from'../instant.schema.ts';
// `query` typechecks against our schema!
const query ={
 goals:{ todos:{}},
} satisfies InstaQLParams<AppSchema>;

```

Or you can define your result type:
```
import{ InstaQLResult }from'@instantdb/react';
import{ AppSchema }from'../instant.schema.ts';
typeGoalsTodosResult= InstaQLResult<
 AppSchema,
{ goals:{ todos:{}}}
>;

```

Or you can extract a particular entity:
```
import{ InstaQLEntity }from'@instantdb/react';
import{ AppSchema }from'../instant.schema.ts';
typeTodo= InstaQLEntity<
 AppSchema,
'todos'
>;

```

You can specify links relative to your entity too:
```
typeTodoWithGoals= InstaQLEntity<
 AppSchema,
'todos',
{ goals:{}}
>;

```

To learn more about writing schemas, check out the [Modeling Data](https://www.instantdb.com/docs/</docs/modeling-data>) section.
## Query once
Sometimes, you don't want a subscription, and just want to fetch data once. For example, you might want to fetch data before rendering a page or check whether a user name is available.
In these cases, you can use `queryOnce` instead of `useQuery`. `queryOnce` returns a promise that resolves with the data once the query is complete.
Unlike `useQuery`, `queryOnce` will throw an error if the user is offline. This is because `queryOnce` is intended for use cases where you need the most up-to-date data.
```
const query ={todos:{}};
const{ data }=await db.queryOnce(query);
// returns the same data as useQuery, but without the isLoading and error fields

```

You can also do pagination with `queryOnce`:
```
const query ={
todos:{
$:{
limit:10,
offset:10,
},
},
};
const{ data, pageInfo }=await db.queryOnce(query);
// pageInfo behaves the same as with useQuery

```

If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Writing data](https://www.instantdb.com/docs/</docs/instaml>)
Next
    [Instant on the backend →](https://www.instantdb.com/docs/</docs/backend>)
## On this page
  1. ### [Fetch namespace](https://www.instantdb.com/docs/</docs/instaql#fetch-namespace>)
  2. ### [Fetch multiple namespaces](https://www.instantdb.com/docs/</docs/instaql#fetch-multiple-namespaces>)
  3. ### [Fetch a specific entity](https://www.instantdb.com/docs/</docs/instaql#fetch-a-specific-entity>)
  4. ### [Fetch associations](https://www.instantdb.com/docs/</docs/instaql#fetch-associations>)
    1. [Comparing with SQL](https://www.instantdb.com/docs/</docs/instaql#comparing-with-sql>)
  5. ### [Fetch specific associations](https://www.instantdb.com/docs/</docs/instaql#fetch-specific-associations>)
    1. [A) Fetch associations for filtered namespace](https://www.instantdb.com/docs/</docs/instaql#a-fetch-associations-for-filtered-namespace>)
    2. [B) Filter namespace by associated values](https://www.instantdb.com/docs/</docs/instaql#b-filter-namespace-by-associated-values>)
    3. [C) Filter associations](https://www.instantdb.com/docs/</docs/instaql#c-filter-associations>)
  6. ### [Inverse Associations](https://www.instantdb.com/docs/</docs/instaql#inverse-associations>)
  7. ### [Pagination](https://www.instantdb.com/docs/</docs/instaql#pagination>)
    1. [Offset](https://www.instantdb.com/docs/</docs/instaql#offset>)
    2. [Cursors](https://www.instantdb.com/docs/</docs/instaql#cursors>)
    3. [Ordering](https://www.instantdb.com/docs/</docs/instaql#ordering>)
  8. ### [Advanced filtering](https://www.instantdb.com/docs/</docs/instaql#advanced-filtering>)
    1. [And](https://www.instantdb.com/docs/</docs/instaql#and>)
    2. [OR](https://www.instantdb.com/docs/</docs/instaql#or>)
    3. [$in](https://www.instantdb.com/docs/</docs/instaql#in>)
    4. [Comparison operators](https://www.instantdb.com/docs/</docs/instaql#comparison-operators>)
    5. [$not](https://www.instantdb.com/docs/</docs/instaql#not>)
    6. [$isNull](https://www.instantdb.com/docs/</docs/instaql#is-null>)
    7. [$like](https://www.instantdb.com/docs/</docs/instaql#like>)
  9. ### [Typesafety](https://www.instantdb.com/docs/</docs/instaql#typesafety>)
    1. [Intellisense](https://www.instantdb.com/docs/</docs/instaql#intellisense>)
    2. [Utility Types](https://www.instantdb.com/docs/</docs/instaql#utility-types>)
  10. ### [Query once](https://www.instantdb.com/docs/</docs/instaql#query-once>)




## Content from https://www.instantdb.com/docs/modeling-data

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Modeling data
In this section we’ll learn how to model data using Instant's schema. By the end of this document you’ll know how to:
  * Create namespaces and attributes
  * Add indexes and unique constraints
  * Model relationships
  * Lock down your schema for production


We’ll build a micro-blog to illustrate; we'll have authors, posts, comments, and tags.
## Schema as Code
With Instant you can define your schema and your permissions in code. If you haven't already, use the [CLI](https://www.instantdb.com/docs/</docs/cli>) to generate an `instant.schema.ts`, and a `instant.perms.ts` file:
```
npx instant-cli@latest init

```

Copy
The CLI will guide you through picking an Instant app and generate these files for you.
## instant.schema.ts
Now we can define the data model for our blog!
Open `instant.schema.ts`, and paste the following:
```
// instant.schema.ts
import{ i }from"@instantdb/core";
const _schema = i.schema({
 entities:{
  $users: i.entity({
   email: i.string().unique().indexed(),
}),
  profiles: i.entity({
   nickname: i.string(),
   createdAt: i.date(),
}),
  posts: i.entity({
   title: i.string(),
   body: i.string(),
   createdAt: i.date(),
}),
  comments: i.entity({
   body: i.string(),
   createdAt: i.date(),
}),
  tags: i.entity({
   title: i.string(),
}),
},
 links:{
  postAuthor:{
   forward:{ on:"posts", has:"one", label:"author"},
   reverse:{ on:"profiles", has:"many", label:"authoredPosts"},
},
  commentPost:{
   forward:{ on:"comments", has:"one", label:"post"},
   reverse:{ on:"posts", has:"many", label:"comments"},
},
  commentAuthor:{
   forward:{ on:"comments", has:"one", label:"author"},
   reverse:{ on:"profiles", has:"many", label:"authoredComments"},
},
  postsTags:{
   forward:{ on:"posts", has:"many", label:"tags"},
   reverse:{ on:"tags", has:"many", label:"posts"},
},
  profileUser:{
   forward:{ on:"profiles", has:"one", label:"$user"},
   reverse:{ on:"$users", has:"one", label:"profile"},
},
},
});
// This helps Typescript display better intellisense
type_AppSchema=typeof _schema;
interfaceAppSchemaextends_AppSchema{}
const schema: AppSchema = _schema;
exporttype{ AppSchema };
exportdefault schema;

```

Copy
Let's unpack what we just wrote. There are three core building blocks to model data with Instant: **Namespaces** , **Attributes** , and **Links**.
## 1) Namespaces
Namespaces are equivelant to "tables" in relational databases or "collections" in NoSQL. In our case, these are: `$users`, `profiles`, `posts`, `comments`, and `tags`.
They're all defined in the `entities` section:
```
// instant.schema.ts
const _schema = i.schema({
 entities:{
  posts: i.entity({
// ...
}),
},
});

```

## 2) Attributes
Attributes are properties associated with namespaces. These are equivelant to a "column" in relational databases or a "field" in NoSQL. For the `posts` entity, we have the `title`, `body`, and `createdAt` attributes:
```
// instant.schema.ts
const _schema = i.schema({
 entities:{
// ...
  posts: i.entity({
   title: i.string(),
   body: i.string(),
   createdAt: i.date(),
}),
},
});

```

### Typing attributes
Attributes can be typed as `i.string()`, `i.number()`, `i.boolean()`, `i.date()`, `i.json()`, or `i.any()`.
`i.date()` accepts dates as either a numeric timestamp (in milliseconds) or an ISO 8601 string. `JSON.stringify(new Date())` will return an ISO 8601 string.
When you type `posts.title` as a `string`:
```
// instant.schema.ts
const _schema = i.schema({
 entities:{
// ...
  posts: i.entity({
   title: i.string(),
// ...
}),
},
});

```

Instant will _make sure_ that all `title` attributes are strings, and you'll get the proper typescript hints to boot!
### Unique constraints
Sometimes you'll want to introduce a unique constraint. For example, say we wanted to add friendly URL's to posts. We could introduce a `slug` attribute:
```
// instant.schema.ts
const _schema = i.schema({
 entities:{
// ...
  posts: i.entity({
   slug: i.string().unique(),
// ...
}),
},
});

```

Since we're going to use post slugs in URLs, we'll want to make sure that no two posts can have the same slug. If we mark `slug` as `unique`, _Instant will guarantee this constraint for us_.
Plus unique attributes come with their own special index. This means that if you use a unique attribute inside a query, we can fetch the object quickly:
```
const query ={
 posts:{
  $:{
   where:{
// Since `slug` is unique, this query is 🚀 fast
    slug:'completing_sicp',
},
},
},
};

```

### Indexing attributes
Speaking of fast queries, let's take a look at one:
What if we wanted to query for a post that was published at a particular date? Here's a query to get posts that were published during SpaceX's chopstick launch:
```
const rocketChopsticks ='2024-10-13T00:00:00Z';
const query ={ posts:{ $:{ where:{ createdAt: rocketChopsticks }}}};

```

This would work, but the more posts we create, the slower the query would get. We'd have to scan every post and compare the `createdAt` date.
To make this query faster, we can index `createdAt`:
```
// instant.schema.ts
const _schema = i.schema({
 entities:{
// ...
  posts: i.entity({
   createdAt: i.date().indexed(),// 🔥,
// ...
}),
},
});

```

As it says on the tin, this command tells Instant to index the `createdAt` field, which lets us quickly look up entities by this attribute.
## 3) Links
Links connect two namespaces together. When you define a link, you define it both in the 'forward', and the 'reverse' direction. For example:
```
postAuthor:{
 forward:{ on:"posts", has:"one", label:"author"},
 reverse:{ on:"profiles", has:"many", label:"authoredPosts"},
}

```

This links `posts` and `profiles` together:
  * `posts.author` links to _one_ `profiles` entity
  * `profiles.authoredPosts` links back to _many_ `posts` entities.


Since links are defined in both directions, you can query in both directions too:
```
// This queries all posts with their author
const query1 ={
 posts:{
  author:{},
},
};
// This queries profiles, with all of their authoredPosts!
const query2 ={
 profiles:{
  authoredPosts:{},
},
};

```

Links can have one of four relationship types: `many-to-many`, `many-to-one`, `one-to-many`, and `one-to-one`
Our micro-blog example has the following relationship types:
  * **One-to-one** between `profiles` and `$users`
  * **One-to-many** between `posts` and `profiles`
  * **One-to-many** between `comments` and `posts`
  * **One-to-many** between `comments` and `profiles`
  * **Many-to-many** between `posts` and `tags`


### Cascade Delete
Forward links defined with `has: "one"` can set `onDelete: "cascade"`. In this case, when the reverse entity is deleted, all forward entities will be deleted too:
```
postAuthor:{
 forward:{ on:"posts", has:"one", label:"author", onDelete:"cascade"},
 reverse:{ on:"profiles", has:"many", label:"authoredPosts"},
}
// this will delete profile and all linked posts
db.tx.profiles[user_id].delete();

```

Without `onDelete: "cascade"`, deleting a user would simply delete the links but not delete the underlying posts.
## Publishing your schema
Now that you have your schema, you can use the CLI to `push` it to your app:
```
npx instant-cli@latest push schema

```

Copy
The CLI will look at your app in production, show you the new columns you'd create, and run the changes for you!
```
Checking for an Instant SDK...
Found @instantdb/react in your package.json.
Found NEXT_PUBLIC_INSTANT_APP_ID: *****
Planning schema...
The following changes will be applied to your production schema:
ADD ENTITY profiles.id
ADD ENTITY posts.id
ADD ENTITY comments.id
ADD ENTITY tags.id
ADD ATTR profiles.nickname :: unique=false, indexed=false
ADD ATTR profiles.createdAt :: unique=false, indexed=false
ADD ATTR posts.title :: unique=false, indexed=false
ADD ATTR posts.slug :: unique=true, indexed=false
ADD ATTR posts.body :: unique=false, indexed=false
ADD ATTR posts.createdAt :: unique=false, indexed=true
ADD ATTR comments.body :: unique=false, indexed=false
ADD ATTR comments.createdAt :: unique=false, indexed=false
ADD ATTR tags.title :: unique=false, indexed=false
ADD LINK posts.author <=> profiles.authoredPosts
ADD LINK comments.post <=> posts.comments
ADD LINK comments.author <=> profiles.authoredComments
ADD LINK posts.tags <=> tags.posts
ADD LINK profiles.$user <=> $users.profile
? **OK to proceed? yes
Schema updated!**
```

## Use schema for typesafety
You can also use your schema inside `init`:
```
import{ init }from'@instantdb/react';
import schema from'../instant.schema.ts';
const db =init({
 appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
 schema,
});

```

When you do this, all [queries](https://www.instantdb.com/docs/</docs/instaql>) and [transactions](https://www.instantdb.com/docs/</docs/instaql>) will come with typesafety out of the box.
If you haven't used the CLI to push your schema yet, no problem. Any time you write `transact`, we'll automatically create missing entities for you.
## Update or Delete attributes
You can always modify or delete attributes after creating them. **You can't use the CLI to do this yet, but you can use the dashboard.**
Say we wanted to rename `posts.createdAt` to `posts.publishedAt`:
  1. Go to your [Dashboard](https://www.instantdb.com/docs/<https:/instantdb.com/dash>)
  2. Click "Explorer"
  3. Click "posts"
  4. Click "Edit Schema"
  5. Click `createdAt`


You'll see a modal that you can use to rename the attribute, index it, or delete it:
![](https://www.instantdb.com/img/docs/modeling-data-rename-attr.png)
## Secure your schema with permissions
In the earlier sections we mentioned that new `entities` and `attributes` can be created on the fly when you call `transact`. This can be useful for development, but you may not want this in production.
To prevent changes to your schema on the fly, simply add these permissions to your app.
```
// instant.perms.ts
importtype{ InstantRules }from'@instantdb/react';
const rules ={
 attrs:{
  allow:{
   $default:'false',
},
},
} satisfies InstantRules;
exportdefault rules;

```

Once you push these permissions to production:
```
npx instant-cli@latest push perms

```

```
Checking for an Instant SDK...
Found @instantdb/react in your package.json.
Found NEXT_PUBLIC_INSTANT_APP_ID: *****
Planning perms...
The following changes will be applied to your perms:
-null
+{
+ attrs: {
+  allow: {
+   $default: "false"
+  }
+ }
+}
**OK to proceed? yes
Permissions updated!**
```

You'll still be able to make changes in the explorer or with the CLI, but client-side transactions that try to modify your schema will fail. This means your schema is safe from unwanted changes!
**If you've made it this far, congratulations! You should now be able to fully customize and lock down your data model. Huzzah!**
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Init](https://www.instantdb.com/docs/</docs/init>)
Next
    [Writing data →](https://www.instantdb.com/docs/</docs/instaml>)
## On this page
  1. ### [Schema as Code](https://www.instantdb.com/docs/</docs/modeling-data#schema-as-code>)
  2. ### [instant.schema.ts](https://www.instantdb.com/docs/</docs/modeling-data#instant-schema-ts>)
  3. ### [1) Namespaces](https://www.instantdb.com/docs/</docs/modeling-data#1-namespaces>)
  4. ### [2) Attributes](https://www.instantdb.com/docs/</docs/modeling-data#2-attributes>)
    1. [Typing attributes](https://www.instantdb.com/docs/</docs/modeling-data#typing-attributes>)
    2. [Unique constraints](https://www.instantdb.com/docs/</docs/modeling-data#unique-constraints>)
    3. [Indexing attributes](https://www.instantdb.com/docs/</docs/modeling-data#indexing-attributes>)
  5. ### [3) Links](https://www.instantdb.com/docs/</docs/modeling-data#3-links>)
    1. [Cascade Delete](https://www.instantdb.com/docs/</docs/modeling-data#cascade-delete>)
  6. ### [Publishing your schema](https://www.instantdb.com/docs/</docs/modeling-data#publishing-your-schema>)
  7. ### [Use schema for typesafety](https://www.instantdb.com/docs/</docs/modeling-data#use-schema-for-typesafety>)
  8. ### [Update or Delete attributes](https://www.instantdb.com/docs/</docs/modeling-data#update-or-delete-attributes>)
  9. ### [Secure your schema with permissions](https://www.instantdb.com/docs/</docs/modeling-data#secure-your-schema-with-permissions>)




## Content from https://www.instantdb.com/docs/patterns

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Patterns
Below are some common patterns for working with InstantDB. We'll add more patterns over time and if you have a pattern you'd like to share, please feel free to submit a PR for this page.
## You can expose your app id to the client.
Similar to Firebase, the app id is a unique identifier for your application. If you want to secure your data, you'll want to add [permissions](https://www.instantdb.com/docs/</docs/permissions>) for the app.
## Restrict creating new attributes.
When your ready to lock down your schema, you can restrict creating a new attribute by adding this to your app's [permissions](https://www.instantdb.com/docs/</dash?t=perms>)
```
{
"attrs":{"allow":{"$default":"false"}}
}

```

This will prevent any new attributes from being created.
## Specify attributes you want to query.
When you query a namespace, it will return all the attributes for an entity. We don't currently support specifying which attributes you want to query.
This means if you have private data in an entity, or some larger data you want to fetch sometimes, you'll want to split the entity into multiple namespaces. [Here's an example](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant/blob/main/client/sandbox/react-nextjs/pages/patterns/split-attributes.tsx>)
## Setting limits via permissions.
If you want to limit the number of entities a user can create, you can do so via permissions. Here's an example of limiting a user to creating at most 2 todos.
First the [schema](https://www.instantdb.com/docs/</docs/modeling-data>):
```
// instant.schema.ts
// Here we define users, todos, and a link between them.
import{ i }from"@instantdb/core";
const _schema = i.schema({
 entities:{
  $users: i.entity({
   email: i.string().unique().indexed(),
}),
  todos: i.entity({
   label: i.string(),
}),
},
 links:{
  userTodos:{
   forward:{
    on:"todos",
    has:"one",
    label:"owner",
},
   reverse:{
    on:"$users",
    has:"many",
    label:"ownedTodos",
},
},
},
});
// This helps Typescript display nicer intellisense
type_AppSchema=typeof _schema;
interfaceAppSchemaextends_AppSchema{}
const schema: AppSchema = _schema;
exporttype{ AppSchema };
exportdefault schema;

```

Then the [permissions](https://www.instantdb.com/docs/</docs/permissions>):
```
importtype{ InstantRules }from'@instantdb/core';
// instant.perms.ts
// And now we reference the `owner` link for todos to check the number
// of todos a user has created.
// (Note): Make sure the `owner` link is already defined in the schema.
// before you can reference it in the permissions.
const rules ={
 todos:{
  allow:{
   create:"size(data.ref('owner.todos.id')) <= 2",
},
},
} satisfies InstantRules;
exportdefault rules;

```

## Listen to InstantDB connection status.
Sometimes you want to let clients know when they are connected or disconnected to the DB. You can use `db.subscribeConnectionStatus` in vanilla JS or `db.useConnectionStatus` in React to listen to connection changes
```

// Vanilla JS
const unsub = db.subscribeConnectionStatus((status)=>{
const connectionState =
  status ==='connecting'|| status ==='opened'
?'authenticating'
: status ==='authenticated'
?'connected'
: status ==='closed'
?'closed'
: status ==='errored'
?'errored'
:'unexpected state';
console.log('Connection status:', connectionState);
});
// React/React Native
functionApp(){
const status = db.useConnectionStatus()
const connectionState =
  status ==='connecting'|| status ==='opened'
?'authenticating'
: status ==='authenticated'
?'connected'
: status ==='closed'
?'closed'
: status ==='errored'
?'errored'
:'unexpected state';
return<div>Connection state:{connectionState}</div>
}

```

If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
Next
    [Showcase →](https://www.instantdb.com/docs/</docs/showcase>)
## On this page
  1. ### [You can expose your app id to the client.](https://www.instantdb.com/docs/</docs/patterns#you-can-expose-your-app-id-to-the-client>)
  2. ### [Restrict creating new attributes.](https://www.instantdb.com/docs/</docs/patterns#restrict-creating-new-attributes>)
  3. ### [Specify attributes you want to query.](https://www.instantdb.com/docs/</docs/patterns#specify-attributes-you-want-to-query>)
  4. ### [Setting limits via permissions.](https://www.instantdb.com/docs/</docs/patterns#setting-limits-via-permissions>)
  5. ### [Listen to InstantDB connection status.](https://www.instantdb.com/docs/</docs/patterns#listen-to-instant-db-connection-status>)




## Content from https://www.instantdb.com/docs/permissions

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Authentication and Permissions
# Permissions
To secure user data, you can use Instant’s Rule Language. Our rule language takes inspiration from Rails’ ActiveRecord, Google’s CEL, and JSON. Here’s an example ruleset below
```
// instant.perms.ts
importtype{ InstantRules }from"@instantdb/react";
const rules ={
 todos:{
  allow:{
   view:"auth.id != null",
   create:"isOwner",
   update:"isOwner",
delete:"isOwner",
},
  bind:["isOwner","auth.id != null && auth.id == data.creatorId"],
},
} satisfies InstantRules;
exportdefault rules;

```

Copy
You can manage permissions via configuration files or through the Instant dashboard.
## Permissions as code
With Instant you can define your permissions in code. If you haven't already, use the [CLI](https://www.instantdb.com/docs/</docs/cli>) to generate an `instant.perms.ts` file:
```
npx instant-cli@latest init

```

Copy
The CLI will guide you through picking an Instant app and generate these files for you. Once you've made changes to `instant.perms.ts`, you can use the CLI to push those changes to production:
```
npx instant-cli@latest push perms

```

Copy
## Permissions in the dashboard
For each app in your dashboard, you’ll see a permissions editor. Permissions are expressed as JSON. Each top level key represents one of your namespaces — for example `goals`, `todos`, and the like. There is also a special top-level key `attrs` for defining permissions on creating new types of namespaces and attributes.
## Namespaces
For each namespace you can define `allow` rules for `view`, `create`, `update`, `delete`. Rules must be boolean expressions.
If a rule is not set then by default it evaluates to true. The following three rulesets are all equivalent
In this example we explicitly set each action for `todos` to true
```
"todos":{
"allow":{
"view":"true",
"create":"true",
"update":"true",
"delete":"true"
},

```

In this example we explicitly set `view` to be true. However, all the remaining actions for `todo` also default to true.
```
"todos":{
"allow":{
"view":"true"
},

```

In this example we set no rules, and thus all permission checks pass.
```
{}

```

When you start developing you probably won't worry about permissions. However, once you start shipping your app to users you will want to secure their data!
### View
`view` rules are evaluated when doing `db.useQuery`. On the backend every object that satisfies a query will run through the `view` rule before being passed back to the client. This means as a developer you can ensure that no matter what query a user executes, they’ll _only_ see data that they are allowed to see.
### Create, Update, Delete
Similarly, for each object in a transaction, we make sure to evaluate the respective `create`, `update`, and `delete` rule. Transactions will fail if a user does not have adequate permission.
### Default permissions
By default, all permissions are considered to be `"true"`. To change that, use `"$default"` key. This:
```
"todos":{
"allow":{
"$default":"false"
}
}

```

is equivalent to this:
```
"todos":{
"allow":{
"view":"false",
"create":"false",
"update":"false",
"delete":"false",
}
}

```

Specific keys can override defaults:
```
"todos":{
"allow":{
"$default":"false",
"view":"true"
}
}

```

You can use `$default` as the namespace:
```
"$default":{
"allow":{
"view":"false"
}
},
"todos":{
"allow":{
"view":"true"
}
}

```

Finally, the ultimate default:
```
"$default":{
"allow":{
"$default":"false"
}
}

```

## Attrs
Attrs are a special kind of namespace for creating new types of data on the fly. Currently we only support creating attrs. During development you likely don't need to lock this rule down, but once you ship you will likely want to set this permission to `false`
Suppose our data model looks like this
```
{
"goals":{"id": UUID,"title": string }
}

```

And we have a rules defined as
```
{
"attrs":{"allow":{"create":"false"}}
}

```

Then we could create goals with existing attr types:
```
db.transact(db.tx.goals[id()].update({title:"Hello World"})

```

But we would not be able to create goals with new attr types:
```
db.transact(db.tx.goals[id()].update({title:"Hello World",priority:"high"})

```

## CEL expressions
Inside each rule, you can write CEL code that evaluates to either `true` or `false`.
```
{
"todos":{
"allow":{
"view":"auth.id != null",
"create":"auth.id in data.ref('creator.id')",
"update":"!(newData.title == data.title)",
"delete":"'joe@instantdb.com' in data.ref('users.email')"
}
}
}

```

The above example shows a taste of the kind of rules you can write :)
### data
`data` refers to the object you have saved. This will be populated when used for `view`, `create`, `update`, and `delete` rules
### newData
In `update`, you'll also have access to `newData`. This refers to the changes that are being made to the object.
### bind
`bind` allows you to alias logic. The following are equivalent
```
{
"todos":{
"allow":{
"create":"isOwner"
},
"bind":["isOwner","auth.id != null && auth.id == data.creatorId"]
}
}

```

```
{
"todos":{
"allow":{
"create":"auth.id != null && auth.id == data.creatorId"
}
}
}

```

`bind` is useful for not repeating yourself and tidying up rules
```
{
"todos":{
"allow":{
"create":"isOwner || isAdmin"
},
"bind":[
"isOwner",
"auth.id != null && auth.id == data.creatorId",
"isAdmin",
"auth.email in ['joe@instantdb.com', 'stopa@instantdb.com']"
]
}
}

```

### ref
You can also refer to relations in your permission checks. This rule restricts delete to only succeed on todos associated with a specific user email.
```
{
"todos":{
"allow":{
"delete":"'joe@instantdb.com' in data.ref('users.email')"
}
}
}

```

`ref` works on the `auth` object too. Here's how you could restrict `deletes` to users with the 'admin' role:
```
{
 todos:{
  allow:{
   delete:"'admin' in auth.ref('$user.role.type')",
},
},
};

```

See [managing users](https://www.instantdb.com/docs/</docs/users>) to learn more about that.
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
Next
    [Managing users →](https://www.instantdb.com/docs/</docs/users>)
## On this page
  1. ### [Permissions as code](https://www.instantdb.com/docs/</docs/permissions#permissions-as-code>)
  2. ### [Permissions in the dashboard](https://www.instantdb.com/docs/</docs/permissions#permissions-in-the-dashboard>)
  3. ### [Namespaces](https://www.instantdb.com/docs/</docs/permissions#namespaces>)
    1. [View](https://www.instantdb.com/docs/</docs/permissions#view>)
    2. [Create, Update, Delete](https://www.instantdb.com/docs/</docs/permissions#create-update-delete>)
    3. [Default permissions](https://www.instantdb.com/docs/</docs/permissions#default-permissions>)
  4. ### [Attrs](https://www.instantdb.com/docs/</docs/permissions#attrs>)
  5. ### [CEL expressions](https://www.instantdb.com/docs/</docs/permissions#cel-expressions>)
    1. [data](https://www.instantdb.com/docs/</docs/permissions#data>)
    2. [newData](https://www.instantdb.com/docs/</docs/permissions#new-data>)
    3. [bind](https://www.instantdb.com/docs/</docs/permissions#bind>)
    4. [ref](https://www.instantdb.com/docs/</docs/permissions#ref>)




## Content from https://www.instantdb.com/docs/presence-and-topics

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Platform features
# Presence, Cursors, and Activity
Sometimes you want to show real-time updates to users without persisting the data to your database. Common scenarios include:
  * Shared cursors in a collaborative whiteboard like Figma
  * Who's online in a document editor like Google Docs
  * Typing indicators in chat apps like Discord
  * Live reactions in a video streaming app like Twitch


Instant provides three primitives for quickly building these ephemeral experiences: rooms, presence, and topics.
**Rooms**
A room represents a temporary context for realtime events. Users in the same room will receive updates from every other user in that room.
**Presence**
Presence is an object that each peer shares with every other peer. When a user updates their presence, it's instantly replicated to all users in that room. Presence persists throughout the remainder of a user's connection, and is automatically cleaned up when a user leaves the room
You can use presence to build features like "who's online." Instant's cursor and typing indicator are both built on top of the presence API.
**Topics**
Topics have "fire and forget" semantics, and are better suited for data that don't need any sort of persistence. When a user publishes a topic, a callback is fired for every other user in the room listening for that topic.
You can use topics to build features like "live reactions." The real-time emoji button panel on Instant's homepage is built using the topics API.
**Transact vs. Ephemeral**
You may be thinking when would I use `transact` vs `presence` vs `topics`? Here's a simple breakdown:
  * Use `transact` when you need to persist data to the db. For example, when a user sends a message in a chat app.
  * Use `presence` when you need to persist data in a room but not to the db. For example, showing who's currently viewing a document.
  * Use `topics` when you need to broadcast data to a room, but don't need to persist it. For example, sending a live reaction to a video stream.


## Setup
To obtain a room reference, call `db.room(roomType, roomId)`
```
import{ init }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID='__APP_ID__';
// db will export all the presence hooks you need!
const db =init({ appId:APP_ID});
// Specifying a room type and room id gives you the power to
// restrict sharing to a specific room. However you can also just use
// `db.room()` to share presence and topics to an Instant generated default room
const roomId ='hacker-chat-room-id';
const room = db.room('chat', roomId);

```

## Typesafety
By default rooms accept any kind of data. However, you can enforce typesafety with a schema:
```
import{ init }from'@instantdb/react';
import schema from'../instant.schema.ts';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID='__APP_ID__';
const db =init({ appId:APP_ID, schema });
const roomId ='hacker-chat-room-id';
// The `chat` room is typed automatically from schema!
const room = db.room('chat', roomId);

```

Here's how we could add typesafety to our `chat` rooms:
```
// instant.schema.ts
import{ i }from'@instantdb/core';
const _schema = i.schema({
// ...
 rooms:{
// 1. `chat` is the `roomType`
  chat:{
// 2. Choose what presence looks like here
   presence: i.entity({
    name: i.string(),
    status: i.string(),
}),
   topics:{
// 3. You can define payloads for different topics here
    sendEmoji: i.entity({
     emoji: i.string(),
}),
},
},
},
});
// This helps Typescript display better intellisense
type_AppSchema=typeof _schema;
interfaceAppSchemaextends_AppSchema{}
const schema: AppSchema = _schema;
exporttype{ AppSchema };
exportdefault schema;

```

Once you've updated your schema, you'll start seeing types in your intellisense:
![](https://www.instantdb.com/img/docs/presence-intellisence.png)
## Presence
One common use case for presence is to show who's online.
Instant's `usePresence` is similar in feel to `useState`. It returns an object containing the current user's presence state, the presence state of every other user in the room, and a function (`publishPresence`) to update the current user's presence. `publishPresence` is similar to React's `setState`, and will merge the current and new presence objects.
```
import{ init }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
const db =init({ appId:APP_ID});
const room = db.room('chat','hacker-chat-room-id');
const randomId = Math.random().toString(36).slice(2,6);
const user ={
 name:`User#${randomId}`,
};
functionApp(){
const{ user: myPresence, peers, publishPresence }= db.rooms.usePresence(room);
// Publish your presence to the room
useEffect(()=>{
publishPresence({ name: user.name });
},[]);
if(!myPresence){
return<p>App loading...</p>;
}
return(
<div>
<h1>Who's online?</h1>
<p>You are:{myPresence.name}</p>
<h2>Others:</h2>
<ul>
{/* Loop through all peers and render their names. Peers will have the
     same properties as what you publish to the room. In this case, `name`
     is the only property we're publishing. Use RoomSchema to get type
     safety for your presence object.
   */}
{Object.entries(peers).map(([peerId, peer])=>(
<li key={peerId}>{peer.name}</li>
))}
</ul>
</div>
);
}

```

`usePresence` accepts a second parameter to select specific slices of user's presence object.
```
const room = db.room('chat','hacker-chat-room-id');
// We only return the `status` value for each peer
// We will _only_ trigger an update when a user's `status` value changes
const{ user, peers, publishPresence }= db.rooms.usePresence(room,{
 keys:['status'],
});

```

You may also specify an array of `peers` and a `user` flag to further constrain the output. If you wanted a "write-only" hook, it would look like this:
```
// Will not trigger re-renders on presence changes
const room = db.room('chat','hacker-chat-room-id');
const{ publishPresence }= db.rooms.usePresence(room,{
 peers:[],
 user:false,
});

```

## Topics
Instant provides 2 hooks for sending and handling events for a given topic. `usePublishTopic` returns a function you can call to publish an event, and `useTopicEffect` will be called each time a peer in the same room publishes a topic event.
Here's a live reaction feature using topics. You can also play with it live on [our examples page](https://www.instantdb.com/docs/<https:/www.instantdb.com/examples#5-reactions>)
```
'use client';
import{ init }from'@instantdb/react';
import{ RefObject, createRef, useRef }from'react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
// Set up room schema
const emoji ={
 fire:'🔥',
 wave:'👋',
 confetti:'🎉',
 heart:'❤️',
}asconst;
typeEmojiName=keyoftypeof emoji;
const db =init({
 appId:APP_ID,
});
const room = db.room('main');
exportdefaultfunctionInstantTopics(){
// Use publishEmoji to broadcast to peers listening to `emoji` events.
const publishEmoji = db.rooms.usePublishTopic(room,'emoji');
// Use useTopicEffect to listen for `emoji` events from peers
// and animate their emojis on the screen.
 db.rooms.useTopicEffect(room,'emoji',({ name, directionAngle, rotationAngle })=>{
if(!emoji[name])return;
animateEmoji(
{ emoji: emoji[name], directionAngle, rotationAngle },
   elRefsRef.current[name].current
);
});
const elRefsRef =useRef<{
[k:string]: RefObject<HTMLDivElement>;
}>(refsInit);
return(
<div className={containerClassNames}>
<div className="flex gap-4">
{emojiNames.map((name)=>(
<div className="relative" key={name} ref={elRefsRef.current[name]}>
<button
       className={emojiButtonClassNames}
/* We sent an emoji! Let's animate and broadcast it! */
       onClick={()=>{
const params ={
         name,
         rotationAngle: Math.random()*360,
         directionAngle: Math.random()*360,
};
/* Animate the emoji on our screen */
animateEmoji(
{
          emoji: emoji[name],
          rotationAngle: params.rotationAngle,
          directionAngle: params.directionAngle,
},
         elRefsRef.current[name].current
);
/* Broadcast our emoji to our peers! */
publishEmoji(params);
}}
>
{emoji[name]}
</button>
</div>
))}
</div>
</div>
);
}
// Below are helper functions and styles used to animate the emojis
const emojiNames = Object.keys(emoji)as EmojiName[];
const refsInit = Object.fromEntries(
 emojiNames.map((name)=>[name,createRef<HTMLDivElement>()])
);
const containerClassNames =
'flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-200 select-none';
const emojiButtonClassNames =
'rounded-lg bg-white p-3 text-3xl shadow-lg transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl';
functionanimateEmoji(
 config:{ emoji:string; directionAngle:number; rotationAngle:number},
 target: HTMLDivElement |null
){
if(!target)return;
const rootEl = document.createElement('div');
const directionEl = document.createElement('div');
const spinEl = document.createElement('div');
 spinEl.innerText = config.emoji;
 directionEl.appendChild(spinEl);
 rootEl.appendChild(directionEl);
 target.appendChild(rootEl);
style(rootEl,{
  transform:`rotate(${config.directionAngle *360}deg)`,
  position:'absolute',
  top:'0',
  left:'0',
  right:'0',
  bottom:'0',
  margin:'auto',
  zIndex:'9999',
  pointerEvents:'none',
});
style(spinEl,{
  transform:`rotateZ(${config.rotationAngle *400}deg)`,
  fontSize:`40px`,
});
setTimeout(()=>{
style(directionEl,{
   transform:`translateY(40vh) scale(2)`,
   transition:'all 400ms',
   opacity:'0',
});
},20);
setTimeout(()=> rootEl.remove(),800);
}
functionstyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>){
 Object.assign(el.style, styles);
}

```

Copy
## Cursors and Typing Indicators (React only)
We wanted to make adding real-time features to your apps as simple as possible, so we shipped our React library with 2 drop-in utilities: `Cursors` and `useTypingIndicator`.
### Cursors
Adding multiplayer cursors to your app is as simple as importing our `<Cursors>` component!
```
'use client';
import{ init, Cursors }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
const db =init({ appId:APP_ID});
const room = db.room("chat","main");
exportdefaultfunctionApp(){
return(
<Cursors room={room} className="h-full w-full" userCursorColor="tomato">
<div style={{ width:"100vw", height:"100vh"}}>
    Open two tabs, and move your cursor around!
</div>
</Cursors>
);
}

```

Copy
You can provide a `renderCursor` function to return your own custom cursor component.
```
<Cursors
 room={room}
 className="cursors"
 userCursorColor="papayawhip"
 renderCursor={renderCoolCustomCursor}
/>

```

You can render multiple cursor spaces. For instance, imagine you're building a screen with multiple tabs. You want to only show cursors on the same tab as the current user. You can provide each `<Cursors />` element with their own `spaceId`.
```
<Tabs>
{tabs.map((tab)=>(
<Tab>
<Cursors room={room} spaceId={`tab-${tab.id}`} className="tab-cursor">
{/* ... */}
</Cursors>
</Tab>
))}
</Tabs>

```

### Typing indicators
`useTypingIndicator` is a small utility useful for building inputs for chat-style apps. You can use this hook to show things like "<user> is typing..." in your chat app.
```
'use client';
import{ init }from'@instantdb/react';
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID='__APP_ID__';
const db =init({appId:APP_ID});
const randomId =Math.random().toString(36).slice(2,6);
const user ={
name:`User#${randomId}`,
};
const room = db.room('chat','hacker-chat-room-id');
exportdefaultfunctionInstantTypingIndicator(){
// 1. Publish your presence in the room.
 db.rooms.useSyncPresence(room, user);
// 2. Use the typing indicator hook
const typing = db.rooms.useTypingIndicator(room,'chat');
constonKeyDown=(e)=>{
// 3. Render typing indicator
  typing.inputProps.onKeyDown(e);
// 4. Optionally run your own onKeyDown logic
if(e.key==='Enter'&&!e.shiftKey){
   e.preventDefault();
console.log('Message sent:', e.target.value);
}
};
return(
<div className="flex h-screen gap-3 p-2">
<div key="main" className="flex flex-1 flex-col justify-end">
<textarea
     onBlur={typing.inputProps.onBlur}
     onKeyDown={onKeyDown}
     placeholder="Open two tabs and start typing..."
     className="w-full rounded-md border-gray-300 p-2 text-sm"
/>
<div className="truncate text-xs text-gray-500">
{typing.active.length?typingInfo(typing.active):<>&nbsp;</>}
</div>
</div>
</div>
);
}
functiontypingInfo(users){
if(users.length===0)returnnull;
if(users.length===1)return`${users[0].name} is typing...`;
if(users.length===2)
return`${users[0].name} and ${users[1].name} are typing...`;
return`${users[0].name} and ${users.length-1} others are typing...`;
}

```

Copy
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Managing users](https://www.instantdb.com/docs/</docs/users>)
Next
    [Instant CLI →](https://www.instantdb.com/docs/</docs/cli>)
## On this page
  1. ### [Setup](https://www.instantdb.com/docs/</docs/presence-and-topics#setup>)
  2. ### [Typesafety](https://www.instantdb.com/docs/</docs/presence-and-topics#typesafety>)
  3. ### [Presence](https://www.instantdb.com/docs/</docs/presence-and-topics#presence>)
  4. ### [Topics](https://www.instantdb.com/docs/</docs/presence-and-topics#topics>)
  5. ### [Cursors and Typing Indicators (React only)](https://www.instantdb.com/docs/</docs/presence-and-topics#cursors-and-typing-indicators-react-only>)
    1. [Cursors](https://www.instantdb.com/docs/</docs/presence-and-topics#cursors>)
    2. [Typing indicators](https://www.instantdb.com/docs/</docs/presence-and-topics#typing-indicators>)




## Content from https://www.instantdb.com/docs/schema

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Introduction
# Getting started
Instant is the Modern Firebase. With Instant you can easily build realtime and collaborative apps like Notion or Figma.
Curious about what it's all about? Try a [demo](https://www.instantdb.com/docs/<https:/instantdb.com/tutorial>). Have questions? [Join us on discord!](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)
And if you're ready, follow the quick start below to **build a live app in less than 5 minutes!**
## Quick start
To use Instant in a brand new project, fire up your terminal and run the following:
```
npx create-next-app -e hello-world instant-demo
cd instant-demo
npm i @instantdb/react
npm run dev

```

Copy
Now open up `app/page.tsx` in your favorite editor and replace the entirety of the file with the following code.
```
"use client";
import{ id, i, init,InstaQLEntity}from"@instantdb/react";
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
// Optional: Declare your schema!
const schema = i.schema({
entities:{
todos: i.entity({
text: i.string(),
done: i.boolean(),
createdAt: i.number(),
}),
},
});
type Todo=InstaQLEntity<typeof schema,"todos">;
const db =init({appId:APP_ID, schema });
functionApp(){
// Read Data
const{ isLoading, error, data }= db.useQuery({todos:{}});
if(isLoading){
return;
}
if(error){
return<div>Error querying data:{error.message}</div>;
}
const{ todos }= data;
return(
<div style={styles.container}>
<div style={styles.header}>todos</div>
<TodoForm todos={todos}/>
<TodoList todos={todos}/>
<ActionBar todos={todos}/>
<div style={styles.footer}>
Open another tab to see todos update in realtime!
</div>
</div>
);
}
// Write Data
// ---------
functionaddTodo(text: string){
 db.transact(
  db.tx.todos[id()].update({
   text,
done:false,
createdAt:Date.now(),
})
);
}
functiondeleteTodo(todo:Todo){
 db.transact(db.tx.todos[todo.id].delete());
}
functiontoggleDone(todo:Todo){
 db.transact(db.tx.todos[todo.id].update({done:!todo.done}));
}
functiondeleteCompleted(todos:Todo[]){
const completed = todos.filter((todo)=> todo.done);
const txs = completed.map((todo)=> db.tx.todos[todo.id].delete());
 db.transact(txs);
}
functiontoggleAll(todos:Todo[]){
const newVal =!todos.every((todo)=> todo.done);
 db.transact(todos.map((todo)=> db.tx.todos[todo.id].update({done: newVal })));
}
// Components
// ----------
functionTodoForm({ todos }:{todos:Todo[]}){
return(
<div style={styles.form}>
<div style={styles.toggleAll} onClick={()=>toggleAll(todos)}>
    ⌄
</div>
<form
    onSubmit={(e)=>{
     e.preventDefault();
addTodo(e.target[0].value);
     e.target[0].value="";
}}
>
<input
     style={styles.input}
     autoFocus
     placeholder="What needs to be done?"
     type="text"
/>
</form>
</div>
);
}
functionTodoList({ todos }:{todos:Todo[]}){
return(
<div style={styles.todoList}>
{todos.map((todo)=>(
<div key={todo.id} style={styles.todo}>
<input
      type="checkbox"
      key={todo.id}
      style={styles.checkbox}
      checked={todo.done}
      onChange={()=>toggleDone(todo)}
/>
<div style={styles.todoText}>
{todo.done?(
<span style={{textDecoration:"line-through"}}>
{todo.text}
</span>
):(
<span>{todo.text}</span>
)}
</div>
<span onClick={()=>deleteTodo(todo)} style={styles.delete}>
      𝘟
</span>
</div>
))}
</div>
);
}
functionActionBar({ todos }:{todos:Todo[]}){
return(
<div style={styles.actionBar}>
<div>Remaining todos:{todos.filter((todo)=>!todo.done).length}</div>
<div style={{cursor:"pointer"}} onClick={()=>deleteCompleted(todos)}>
DeleteCompleted
</div>
</div>
);
}
// Styles
// ----------
conststyles:Record<string,React.CSSProperties>={
container:{
boxSizing:"border-box",
fontFamily:"code, monospace",
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
flexDirection:"column",
},
header:{
letterSpacing:"2px",
fontSize:"50px",
color:"lightgray",
marginBottom:"10px",
},
form:{
boxSizing:"inherit",
display:"flex",
border:"1px solid lightgray",
borderBottomWidth:"0px",
width:"350px",
},
toggleAll:{
fontSize:"30px",
cursor:"pointer",
marginLeft:"11px",
marginTop:"-6px",
width:"15px",
marginRight:"12px",
},
input:{
backgroundColor:"transparent",
fontFamily:"code, monospace",
width:"287px",
padding:"10px",
fontStyle:"italic",
},
todoList:{
boxSizing:"inherit",
width:"350px",
},
checkbox:{
fontSize:"30px",
marginLeft:"5px",
marginRight:"20px",
cursor:"pointer",
},
todo:{
display:"flex",
alignItems:"center",
padding:"10px",
border:"1px solid lightgray",
borderBottomWidth:"0px",
},
todoText:{
flexGrow:"1",
overflow:"hidden",
},
delete:{
width:"25px",
cursor:"pointer",
color:"lightgray",
},
actionBar:{
display:"flex",
justifyContent:"space-between",
width:"328px",
padding:"10px",
border:"1px solid lightgray",
fontSize:"10px",
},
footer:{
marginTop:"20px",
fontSize:"10px",
},
};
exportdefaultApp;

```

Copy
Go to `localhost:3000` and follow the final instruction to load the app!
Huzzah 🎉 You've got your first Instant web app running! Check out the [Working with data](https://www.instantdb.com/docs/</docs/init>) section to learn more about how to use Instant :)
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Next
    [Init →](https://www.instantdb.com/docs/</docs/init>)
## On this page
  1. ### [Quick start](https://www.instantdb.com/docs/</docs#quick-start>)


Instant - The Modern Firebase.


## Content from https://www.instantdb.com/docs/showcase

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Working with data
# Showcase
## Sample Apps
Here are some sample apps showing how to use Instant to build a real app.
  * [Instldraw](https://www.instantdb.com/docs/<https:/github.com/jsventures/instldraw>) - collaborative drawing app built with Instant.
  * [Instant Awedience](https://www.instantdb.com/docs/<https:/github.com/nezaj/instant-awedience>) - simple chat app with presence, typing indicators, and reactions!.
  * [Glazepal](https://www.instantdb.com/docs/<https:/github.com/reichert621/glazepal>) - React Native app for managing ceramic glazes
  * [Stroopwafel](https://www.instantdb.com/docs/<https:/github.com/jsventures/stroopwafel>) - casual multiplayer game built with React Native.


## Real World Apps
Here are some apps in production that are powered by Instant.
  * [Palette.tools](https://www.instantdb.com/docs/<https:/palette.tools>) - Palette is a modern, all-in-one project management app for studios & digital artists 🎨
  * [Mentor](https://www.instantdb.com/docs/<https:/goalmentor.app/>) - Simplify your goals and get things done with mentor, your personal assistant
  * [Subset](https://www.instantdb.com/docs/<https:/subset.so/>) - A high-quality, no-frills, modern spreadsheet


## More examples
Are you looking for more examples? Do you want to contribute your app to this list? Let us know on [discord](https://www.instantdb.com/docs/<https:/discord.gg/8J6kZfV>) or [twitter](https://www.instantdb.com/docs/<https:/twitter.com/intent/tweet?text=%40useinstantdb>)
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Patterns](https://www.instantdb.com/docs/</docs/patterns>)
Next
    [Auth →](https://www.instantdb.com/docs/</docs/auth>)
## On this page
  1. ### [Sample Apps](https://www.instantdb.com/docs/</docs/showcase#sample-apps>)
  2. ### [Real World Apps](https://www.instantdb.com/docs/</docs/showcase#real-world-apps>)
  3. ### [More examples](https://www.instantdb.com/docs/</docs/showcase#more-examples>)




## Content from https://www.instantdb.com/docs/start-rn

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Introduction
# Getting started with React Native
You can use Instant in React Native projects too! Below is an example using Expo. Open up your terminal and do the following:
```
# Create an app with expo
npx create-expo-app instant-rn-demo
cd instant-rn-demo
# Install instant
npm i @instantdb/react-native
# Install peer dependencies
npm i @react-native-async-storage/async-storage @react-native-community/netinfo react-native-get-random-values

```

Copy
Now open up `app/(tabs)/index.tsx` in your favorite editor and replace the entirety of the file with the following code.
```
import{ init, i, InstaQLEntity }from"@instantdb/react-native";
import{ View, Text, Button, StyleSheet }from"react-native";
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
// Optional: You can declare a schema!
const schema = i.schema({
 entities:{
  colors: i.entity({
   value: i.string(),
}),
},
});
typeColor= InstaQLEntity<typeof schema,"colors">;
const db =init({ appId:APP_ID, schema });
const selectId ="4d39508b-9ee2-48a3-b70d-8192d9c5a059";
functionApp(){
const{ isLoading, error, data }= db.useQuery({
  colors:{
   $:{ where:{ id: selectId }},
},
});
if(isLoading){
return(
<View>
<Text>Loading...</Text>
</View>
);
}
if(error){
return(
<View>
<Text>Error:{error.message}</Text>
</View>
);
}
return<Main color={data.colors[0]}/>;
}
functionMain(props:{ color?: Color }){
const{ value }= props.color ||{ value:"lightgray"};
return(
<View style={[styles.container,{ backgroundColor: value }]}>
<View style={[styles.contentSection]}>
<Text style={styles.header}>Hi! pick your favorite color</Text>
<View style={styles.spaceX4}>
{["green","blue","purple"].map((c)=>{
return(
<Button
        title={c}
        onPress={()=>{
         db.transact(db.tx.colors[selectId].update({ value: c }));
}}
        key={c}
/>
);
})}
</View>
</View>
</View>
);
}
const styles = StyleSheet.create({
 container:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
},
 spaceY4:{
  marginVertical:16,
},
 spaceX4:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginHorizontal:16,
},
 contentSection:{
  backgroundColor:"white",
  opacity:0.8,
  padding:12,
  borderRadius:8,
},
 header:{
  fontSize:24,
  fontWeight:"bold",
  marginBottom:16,
},
});
exportdefault App;

```

Copy
If you haven't already, install the Expo Go app on iOS or Android. Once you have that installed you can run the app from your terminal.
```
npm run start

```

Scan the QR code with your phone and follow the instructions on the screen :)
Huzzah 🎉 You've got your first React Native Instant app running! Check out the [Working with data](https://www.instantdb.com/docs/</docs/init>) section to learn more about how to use Instant!
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Next
    [Init →](https://www.instantdb.com/docs/</docs/init>)


## Content from https://www.instantdb.com/docs/start-vanilla

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Introduction
# Getting started with Vanilla JS
You can use Instant with plain ol' Javascript/Typescript too. You may find this helpful to integrate Instant with a framework that doesn't have an official SDK yet.
To use Instant in a brand new project fire up your terminal set up a new project with Vite.
```
npx create-vite@latest -t vanilla-ts instant-vanilla
cd instant-vanilla
npm i @instantdb/core
npm run dev

```

Copy
Now open up `src/main.ts` in your favorite editor and replace the entirety of the file with the following code.
```
import{ init, i, id,InstaQLEntity}from"@instantdb/core";
// Visit https://instantdb.com/dash to get your APP_ID :)
constAPP_ID="__APP_ID__";
// Optional: Declare your schema!
const schema = i.schema({
entities:{
todos: i.entity({
text: i.string(),
done: i.boolean(),
createdAt: i.date(),
}),
},
});
type Todo=InstaQLEntity<typeof schema,"todos">;
// Initialize the database
// ---------
const db =init({appId:APP_ID, schema });
// Subscribe to data
// ---------
db.subscribeQuery({todos:{}},(resp)=>{
if(resp.error){
renderError(resp.error.message);// Pro-tip: Check you have the right appId!
return;
}
if(resp.data){
render(resp.data);
}
});
// Write Data
// ---------
functionaddTodo(text: string){
 db.transact(
  db.tx.todos[id()].update({
   text,
done:false,
createdAt:Date.now(),
})
);
focusInput();
}
functiondeleteTodoItem(todo:Todo){
 db.transact(db.tx.todos[todo.id].delete());
}
functiontoggleDone(todo:Todo){
 db.transact(db.tx.todos[todo.id].update({done:!todo.done}));
}
functiondeleteCompleted(todos:Todo[]){
const completed = todos.filter((todo)=> todo.done);
const txs = completed.map((todo)=> db.tx.todos[todo.id].delete());
 db.transact(txs);
}
functiontoggleAllTodos(todos:Todo[]){
const newVal =!todos.every((todo)=> todo.done);
 db.transact(
  todos.map((todo)=> db.tx.todos[todo.id].update({done: newVal }))
);
}
// Styles
// ---------
conststyles:Record<string, string>={
container:`
  box-sizing: border-box;
  background-color: #fafafa;
  font-family: code, monospace;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`,
header:`
  letter-spacing: 2px;
  font-size: 50px;
  color: lightgray;
  margin-bottom: 10px;
`,
form:`
  box-sizing: inherit;
  display: flex;
  border: 1px solid lightgray;
  border-bottom-width: 0px;
  width: 350px;
`,
toggleAll:`
  font-size: 30px;
  cursor: pointer;
  margin-left: 11px;
  margin-top: -6px;
  width: 15px;
  margin-right: 12px;
`,
input:`
  background-color: transparent;
  font-family: code, monospace;
  width: 287px;
  padding: 10px;
  font-style: italic;
`,
todoList:`
  box-sizing: inherit;
  width: 350px;
`,
checkbox:`
  font-size: 30px;
  margin-left: 5px;
  margin-right: 20px;
  cursor: pointer;
`,
todo:`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid lightgray;
  border-bottom-width: 0px;
`,
todoText:`
  flex-grow: 1;
  overflow: hidden;
`,
delete:`
  width: 25px;
  cursor: pointer;
  color: lightgray;
`,
actionBar:`
  display: flex;
  justify-content: space-between;
  width: 328px;
  padding: 10px;
  border: 1px solid lightgray;
  font-size: 10px;
`,
footer:`
  margin-top: 20px;
  font-size: 10px;
`,
};
// Render
// ---------
const app =document.getElementById("app")!;
app.style.cssText= styles.container;
functionrender(data:{todos:Todo[]}){
 app.innerHTML="";
const{ todos }= data;
const containerHTML =`
  <div style="${styles.container}">
   <div style="${styles.header}">todos</div>
${TodoForm()}
${TodoList(todos)}
${ActionBar(todos)}
   <div style="${
    styles.footer
}">Open another tab to see todos update in realtime!</div>
  </div>
`;
 app.innerHTML= containerHTML;
// Attach event listeners
document
.querySelector(".toggle-all")
?.addEventListener("click",()=>toggleAllTodos(todos));
document.querySelector("form")?.addEventListener("submit", submitForm);
 todos.forEach((todo)=>{
document
.getElementById(`toggle-${todo.id}`)
?.addEventListener("change",()=>toggleDone(todo));
document
.getElementById(`delete-${todo.id}`)
?.addEventListener("click",()=>deleteTodoItem(todo));
});
document
.querySelector(".delete-completed")
?.addEventListener("click",()=>deleteCompleted(todos));
}
functionrenderError(errorMessage: string){
 app.innerHTML=`
<div>${errorMessage}</div>
`;
}
functionTodoForm(){
return`
  <div style="${styles.form}">
   <div class="toggle-all" style="${styles.toggleAll}">⌄</div>
   <form>
    <input style="${styles.input}" placeholder="What needs to be done?" type="text" autofocus>
   </form>
  </div>
`;
}
functionTodoList(todos:Todo[]){
return`
  <div style="${styles.todoList}">
${todos
.map(
(todo)=>`
    <div style="${styles.todo}">
     <input id="toggle-${todo.id}" type="checkbox" style="${
      styles.checkbox
}" ${todo.done?"checked":""}>
     <div style="${styles.todoText}">
${
       todo.done
?`<span style="text-decoration: line-through;">${todo.text}</span>`
:`<span>${todo.text}</span>`
}
     </div>
     <span id="delete-${todo.id}" style="${styles.delete}">𝘟</span>
    </div>
`
)
.join("")}
  </div>
`;
}
functionActionBar(todos:Todo[]){
return`
  <div style="${styles.actionBar}">
   <div>Remaining todos: ${todos.filter((todo)=>!todo.done).length}</div>
   <div class="delete-completed" style="cursor: pointer;">Delete Completed</div>
  </div>
`;
}
functionfocusInput(){
const input =document.querySelector<HTMLInputElement>('input[type="text"]');
if(input){
  input.focus();
}
}
functionsubmitForm(event:Event){
 event.preventDefault();
const input =(event.targetasHTMLFormElement).querySelector("input");
if(input && input.value.trim()){
addTodo(input.value);
  input.value="";
}
}

```

Copy
Go to `localhost:5173` and follow the final instruction to load the app!
Huzzah 🎉 You've got your first Instant web app running! Check out the [Working with data](https://www.instantdb.com/docs/</docs/init>) section to learn more about how to use Instant :)
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Next
    [Init →](https://www.instantdb.com/docs/</docs/init>)


## Content from https://www.instantdb.com/docs/storage

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Platform features
# Storage
Instant Storage makes it simple to upload and serve files for your app. You can use Storage to store images, videos, documents, and any other file type.
Storage is still in **beta** , but you can request access [here](https://www.instantdb.com/docs/<https:/docs.google.com/forms/d/e/1FAIpQLSdzInffrNrsYaamtH_BUe917EOpcOq2k8RWcGM19XepJR6ivQ/viewform?usp=sf_link>)!
## Uploading files
We use the `db.storage.upload(pathname: string, file: File)` function to upload a file.
```
asyncfunctionupload(files:FileList){
const file = files[0];
// use the file's current name as the path
await db.storage.upload(file.name, file);
// or, give the file a custom name
await db.storage.upload('demo.png', file);
// or, put it in the `images` subdirectory
await db.storage.upload('images/demo.png', file);
// or, put it in a subdirectory for the current user,
// and restrict access to this file via Storage permissions
await db.storage.upload(`${currentUser.id}/demo.png`, file);
}
return<inputtype="file"onChange={(e)=>upload(e.target.files)}/>;

```

The `pathname` determines where the file will be stored, and can be used with permissions to restrict access to certain files.
The `file` should be a `File`[](https://www.instantdb.com/docs/<https:/developer.mozilla.org/en-US/docs/Web/API/File>) type, which will likely come from a [file-type input](https://www.instantdb.com/docs/<https:/developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file>).
Note that if the `pathname` already exists in your storage directory, it will be overwritten!
You may want to include some kind of unique identifier or timestamp in your `pathname` to ensure this doesn't happen.
## Retrieving files
To retrieve a file URL, we use the `db.storage.getDownloadUrl(pathname: string)` function.
This function returns a signed URL that will be valid for **7 days**.
This is important to keep in mind in cases where you want to save this URL somewhere, as demonstrated below in **Caching the URL**.
```
const[imageUrl, setImageUrl]=React.useState<string|null>(null);
React.useEffect(()=>{
 db.storage
.getDownloadUrl('images/demo.png')
.then((signedUrl)=>setImageUrl(signedUrl))
.catch((err)=>console.error('Failed to get file URL', err));
},[]);
return<imgsrc={imageUrl}/>;

```

### Caching the URL
You might also want to cache the URL after retrieving it, in order to avoid calling `getDownloadUrl` every time you refresh the page.
Let's imagine you have an `images` namespace you use to store the file metadata of your images. You can use this to keep track of the expiration time of all your file URLs, and then refresh them accordingly.
```
// Simple component to upload and display image files
functionApp(){
const{ data }= db.useQuery({ images:{}});
constupload=async(files:FileList)=>{
const file = files[0];
const pathname = file.name;// or whatever custom file path you'd like
const expiresAt =Date.now()+7*24*60*60*1000;// 7 days from now
const isSuccess =await db.storage.upload(pathname, file);
const cachedUrl =await db.storage.getDownloadUrl(pathname);
  db.transact(tx.images[id()].update({ cachedUrl, pathname, expiresAt }));
};
return(
<div>
<inputtype="file"onChange={(e)=>upload(e.target.files)}/>
{data.images.map((image)=>(
<ImageViewerkey={image.id}image={image}/>
))}
</div>
);
}

```

Then, in your `ImageViewer` component, you can use the `cachedUrl` by default, and handle the expiration when necessary:
```
// Component to handle displaying the image URL and refreshing when necessary
functionImageViewer({ image }:{ image:Schema.Image}){
const[imageUrl, setImageUrl]=React.useState(image.cachedUrl);
React.useEffect(()=>{
// If the image URL has expired, refresh the signed url
if(image.expiresAt<Date.now()){
const expiresAt =Date.now()+7*24*60*60*1000;
   db.storage.getDownloadUrl(image.pathname).then((url)=>{
// update the cached url
    db.transact(
     tx.images[image.id].update({
      cachedUrl: url,
// reset expiration to 7 days from now
      expiresAt: expiresAt,
})
);
setImageUrl(url);
});
}
},[image.expiresAt]);
return<imgsrc={imageUrl}/>;
}

```

## Permissions
At the moment, Storage permissions are handled in the same JSON settings as [data permissions](https://www.instantdb.com/docs/</docs/permissions>), using the special `$files` keyword.
To handle permissions for **uploading** files, we use the `create` action.
For **downloading** or **viewing** files, we use the `view` action.
By default, Storage permissions are disabled. This means that until you explicitly set permissions, no uploads or downloads will be possible.
In your permissions rules, you can use `auth` to access the currently authenticated user, and `data` to access the file metadata.
At the moment, the only available file metadata is `data.path`, which represents the file's path in Storage. (In the future we will likely include metadata such as `size` and `type`.)
### Examples
Allow anyone to upload and retrieve files (not recommended):
```
{
"$files":{
"allow":{
"view":"true",
"create":"true"
}
}
}

```

Allow all authenticated users to view and upload files:
```
{
"$files":{
"allow":{
"view":"isLoggedIn",
"create":"isLoggedIn"
},
"bind":["isLoggedIn","auth.id != null"]
}
}

```

Authenticated users may only upload and view files from their own subdirectory:
```
{
"$files":{
"allow":{
"view":"isOwner",
"create":"isOwner"
},
"bind":["isOwner","data.path.startsWith(auth.id + '/')"]
}
}

```

Allow all authenticated users to view files, but users may only upload `png`/`jpeg` image files:
```
{
"$files":{
"allow":{
"view":"auth.id != null",
"create":"isImage"
},
"bind":[
"isImage",
"data.path.endsWith('.png') || data.path.endsWith('.jpeg')"
]
}
}

```

# Admin SDK
The Admin SDK offers the same API for managing storage on the server, plus a few extra convenience methods for scripting.
## Uploading files
Once again, we use the `db.storage.upload(pathname: string, file: Buffer)` function to upload a file on the backend.
Note that unlike our browser SDK, the `file` argument must be a `Buffer`:
```
importfsfrom'fs';
asyncfunctionupload(filepath:string){
const buffer = fs.readFileSync(filepath);
await db.storage.upload('images/demo.png', buffer);
// you can also optionally specify the Content-Type header in the metadata
await db.storage.upload('images/demo.png', buffer,{
  contentType:'image/png',
});
}

```

The `pathname` determines where the file will be stored, and can be used with permissions to restrict access to certain files.
The `file` should be a `Buffer`[](https://www.instantdb.com/docs/<https:/nodejs.org/api/buffer.html>) type.
Note that if the `pathname` already exists in your storage directory, it will be overwritten!
You may want to include some kind of unique identifier or timestamp in your `pathname` to ensure this doesn't happen.
## Retrieving a file URL
To retrieve a file URL, we use the `db.storage.getDownloadUrl(pathname: string)` function.
This works exactly the same as our browser SDK.
```
const url =await db.storage.getDownloadUrl('images/demo.png');

```

## Listing all your files
We also offer the `db.storage.list()` function to retrieve a list of all your files in storage.
This can be useful for scripting, if you'd like to manage your files programmatically.
```
const files =await db.storage.list();

```

## Deleting files
There are two ways to delete files:
  * `db.storage.delete(pathname: string)`
  * `db.storage.deleteMany(pathnames: string[])`


These allow you to either delete a single file, or bulk delete multiple files at a time.
These functions will **permanently delete** files from storage, so use with extreme caution!
```
const filename ='demo.txt';
await db.storage.delete(filename);
const images =['images/1.png','images/2.png','images/3.png'];
await db.storage.deleteMany(images);

```

If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← App teams](https://www.instantdb.com/docs/</docs/teams>)
## On this page
  1. ### [Uploading files](https://www.instantdb.com/docs/</docs/storage#uploading-files>)
  2. ### [Retrieving files](https://www.instantdb.com/docs/</docs/storage#retrieving-files>)
    1. [Caching the URL](https://www.instantdb.com/docs/</docs/storage#caching-the-url>)
  3. ### [Permissions](https://www.instantdb.com/docs/</docs/storage#permissions>)
    1. [Examples](https://www.instantdb.com/docs/</docs/storage#examples>)
  4. ### [Uploading files](https://www.instantdb.com/docs/</docs/storage#uploading-files-2>)
  5. ### [Retrieving a file URL](https://www.instantdb.com/docs/</docs/storage#retrieving-a-file-url>)
  6. ### [Listing all your files](https://www.instantdb.com/docs/</docs/storage#listing-all-your-files>)
  7. ### [Deleting files](https://www.instantdb.com/docs/</docs/storage#deleting-files>)




## Content from https://www.instantdb.com/docs/teams

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Platform features
# App teams (Pro)
Apps with a Pro subscription can be managed by multiple users. To add team members to your app, head on over to the [Dashboard Admin tab](https://www.instantdb.com/docs/<https:/instantdb.com/dash?s=main&t=admin>).
## Roles
App team members can have one of three roles: collaborator, admin or owner.
#### Collaborators
  * Can view the Explorer, update Permissions, and configure Auth.


#### Admins
  * Can invite other team members.


#### Owners (i.e., an app's creator)
  * Can access the Billing tab.
  * Can regenerate the app's admin tokens.
  * Can delete their app.


## Invites
#### Inviting a team member
A pro app's admin or owner simply needs to navigate to the [Dashboard Admin tab](https://www.instantdb.com/docs/<https:/instantdb.com/dash?s=main&t=admin>) and click "Invite a team member". This will open a dialog that accepts an email and role. This will send an email with instructions to the specified address.
#### Accepting an invite
Once an invited user signs up for Instant, they can access the [Dashboard Invites section](https://www.instantdb.com/docs/<https:/instantdb.com/dash?s=invites>) where they can accept or decline the invite.
If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Custom emails](https://www.instantdb.com/docs/</docs/emails>)
Next
    [Storage (beta) →](https://www.instantdb.com/docs/</docs/storage>)
## On this page
  1. ### [Roles](https://www.instantdb.com/docs/</docs/teams#roles>)
  2. ### [Invites](https://www.instantdb.com/docs/</docs/teams#invites>)




## Content from https://www.instantdb.com/docs/users

[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
[![](https://www.instantdb.com/img/icon/logo-512.svg)instant](https://www.instantdb.com/docs/</>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


[Pricing](https://www.instantdb.com/docs/</pricing>)[Examples](https://www.instantdb.com/docs/</examples>)[Essays](https://www.instantdb.com/docs/</essays>)[Docs](https://www.instantdb.com/docs/</docs>)[![](https://www.instantdb.com/marketing/discord-icon.svg)Discord](https://www.instantdb.com/docs/<https:/discord.com/invite/VU53p7uQcE>)[![](https://www.instantdb.com/marketing/github-icon.svg)GitHub](https://www.instantdb.com/docs/<https:/github.com/instantdb/instant>)[Login](https://www.instantdb.com/docs/</dash>)
[Sign up](https://www.instantdb.com/docs/</dash>)
Search DocsSearch docs``Ctrl ``K``
  * ## Introduction
    * [Getting started w/ React](https://www.instantdb.com/docs/</docs>)
    * [Getting started w/ React Native](https://www.instantdb.com/docs/</docs/start-rn>)
    * [Getting started w/ Vanilla JS](https://www.instantdb.com/docs/</docs/start-vanilla>)
  * ## Working with data
    * [Init](https://www.instantdb.com/docs/</docs/init>)
    * [Modeling data](https://www.instantdb.com/docs/</docs/modeling-data>)
    * [Writing data](https://www.instantdb.com/docs/</docs/instaml>)
    * [Reading data](https://www.instantdb.com/docs/</docs/instaql>)
    * [Instant on the backend](https://www.instantdb.com/docs/</docs/backend>)
    * [Patterns](https://www.instantdb.com/docs/</docs/patterns>)
    * [Showcase](https://www.instantdb.com/docs/</docs/showcase>)
  * ## Authentication and Permissions
    * [Auth](https://www.instantdb.com/docs/</docs/auth>)
    * [Magic codes](https://www.instantdb.com/docs/</docs/auth/magic-codes>)
    * [Google OAuth](https://www.instantdb.com/docs/</docs/auth/google-oauth>)
    * [Sign In with Apple](https://www.instantdb.com/docs/</docs/auth/apple>)
    * [Clerk](https://www.instantdb.com/docs/</docs/auth/clerk>)
    * [Permissions](https://www.instantdb.com/docs/</docs/permissions>)
  * ## Platform features
    * [Managing users](https://www.instantdb.com/docs/</docs/users>)
    * [Presence, Cursors, and Activity](https://www.instantdb.com/docs/</docs/presence-and-topics>)
    * [Instant CLI](https://www.instantdb.com/docs/</docs/cli>)
    * [Custom emails](https://www.instantdb.com/docs/</docs/emails>)
    * [App teams](https://www.instantdb.com/docs/</docs/teams>)
    * [Storage (beta)](https://www.instantdb.com/docs/</docs/storage>)


#### Pick your app
The examples below will be updated with your app ID.
No apps - sign in to create one
Platform features
# Managing users
## See users in your app
You can manage users in your app using the `$users` namespace. This namespace is automatically created when you create an app.
You'll see the `$users` namespace in the `Explorer` tab with all the users in your app!
## Querying users
The `$users` namespace can be queried like any normal namespace. However, we've set some default permissions so that only a logged-in user can view their own data.
```
// instant.perms.ts
import type {InstantRules}from"@instantdb/react";
const rules ={
$users:{
allow:{
view:'auth.id == data.id',
create:'false',
delete:'false',
update:'false',
},
},
} satisfies InstantRules;
exportdefault rules;

```

Right now `$users` is a read-only namespace. You can override the `view` permission to whatever you like, but `create`, `delete`, and `update` are restricted.
## Adding properties
Although you cannot directly add properties to the `$users` namespace, you can create links to other namespaces. Here is an example of a schema for a todo app that has users, roles, profiles, and todos:
```
// instant.schema.ts
import{ i }from'@instantdb/react';
const _schema = i.schema({
entities:{
$users: i.entity({
email: i.any().unique().indexed(),
}),
profiles: i.entity({
nickname: i.string(),// We can't add this directly to `$users`
userId: i.string().unique(),
}),
roles: i.entity({
type: i.string().unique(),// We couldn't add this directly to `$users` either
}),
todos: i.entity({
text: i.string(),
userId: i.string(),
completed: i.boolean(),
}),
},
links:{
// `$users` is in the reverse direction for all these links!
todoOwner:{
forward:{on:'todos',has:'one',label:'owner'},
reverse:{on:'$users',has:'many',label:'todos'},
},
userRoles:{
forward:{on:'roles',has:'many',label:'users'},
reverse:{on:'$users',has:'one',label:'role'},
},
userProfiles:{
forward:{on:'profiles',has:'one',label:'user'},
reverse:{on:'$users',has:'one',label:'profile'},
},
},
});
// This helps Typescript display nicer intellisense
type _AppSchema =typeof _schema;
interfaceAppSchemaextends_AppSchema{}
constschema:AppSchema= _schema;
export type {AppSchema};
exportdefault schema;

```

### Links
We created three links `todoOwner`, `userRoles`, and `userProfiles` to link the `$users` namespace to the `todos`, `roles`, and `profiles` namespaces respectively:
```
// instant.schema.ts
import{ i }from'@instantdb/react';
const _schema = i.schema({
// ..
 links:{
// `$users` is in the reverse direction for all these links!
  todoOwner:{
   forward:{ on:'todos', has:'one', label:'owner'},
   reverse:{ on:'$users', has:'many', label:'todos'},
},
  userRoles:{
   forward:{ on:'roles', has:'many', label:'users'},
   reverse:{ on:'$users', has:'one', label:'role'},
},
  userProfiles:{
   forward:{ on:'profiles', has:'one', label:'user'},
   reverse:{ on:'$users', has:'one', label:'profile'},
},
},
});

```

Notice that the `$users` namespace is in the reverse direction for all links. If you try to create a link with `$users` in the forward direction, you'll get an error.
### Attributes
Now take a look at the `profiles` namespace:
```
// instant.schema.ts
import{ i }from'@instantdb/react';
const _schema = i.schema({
 entities:{
// ...
  profiles: i.entity({
   nickname: i.string(),// We can't add this directly to `$users`
}),
},
// ...
});

```

You may be wondering why we didn't add `nickname` directly to the `$users` namespace. This is because the `$users` namespace is read-only and we cannot add properties to it. If you want to add additional properties to a user, you'll need to create a new namespace and link it to `$users`.
Once done, you can include user information in the client like so:
```
// Creates a todo and links the current user as an owner
constaddTodo=(newTodo, currentUser)=>{
const newId =id();
 db.transact(
  tx.todos[newId]
.update({text: newTodo,userId: currentUser.id,completed:false})
// Link the todo to the user with the `owner` label we defined in the schema
.link({owner: currentUser.id}),
);
};
// Creates or updates a user profile with a nickname and links it to the
// current user
constupdateNick=(newNick, currentUser)=>{
const profileId =lookup('email', currentUser.email);
 db.transact([
  tx.profiles[profileId]
.update({userId: currentUser.id,nickname: newNick })
// Link the profile to the user with the `user` label we defined in the schema
.link({user: currentUser.id}),
]);
};

```

If attr creation on the client [is enabled](https://www.instantdb.com/docs/</docs/permissions#attrs>), you can also create new links without having to define them in the schema. In this case you can only link to `$users` and not from `$users`.
```
// Comments is a new namespace! We haven't defined it in the schema.
// ✅ This works!
const commentId =id()
db.transact(
 tx.comments[commentId].update({text:'Hello world',userId: currentUser.id})
.link({$user: currentUser.id}));
// ❌ This will not work! Cannot create a forward link on the fly
const commentId =id()
db.transact([
 tx.comments[id()].update({text:'Hello world',userId: currentUser.id}),
 tx.$users[currentUser.id].link({comment: commentId }))]);
// ❌ This will also not work! Cannot create new properties on `$users`
db.transact(tx.$users[currentUser.id].update({nickname:"Alyssa"}))

```

## User permissions
You can reference the `$users` namespace in your permission rules just like a normal namespace. For example, you can restrict a user to only update their own todos like so:
```
exportdefault{
// users perms...
todos:{
allow:{
// owner is the label from the todos namespace to the $users namespace
update:"auth.id in data.ref('owner.id')",
},
},
};

```

You can also traverse the `$users` namespace directly from the `auth` object via `auth.ref`. When using `auth.ref` the arg must start with `$user`. Here's the equivalent rule to the one above using `auth.ref`:
```
exportdefault{
// users perms...
todos:{
allow:{
// We traverse the users links directly from the auth object
update:"data.id in auth.ref('$user.todos.id')",
},
},
};

```

By creating links to `$users` and leveraging `auth.ref`, you can expressively build more complex permission rules.
```
exportdefault{
// users perms...
"todos":{
"bind":[
"isAdmin","'admin' in auth.ref('$user.role.type')",
"isOwner","data.id in auth.ref('$user.todos.id')"
],
"allow":{
// We traverse the users links directly from the auth object
"update":"isAdmin || isOwner",
}
}
};

```

If you are an LLM trying to learn how to develop with Instant, here are all of the links to the docs:
[Getting started w/ React](https://www.instantdb.com/docs/<https:/instantdb.com/docs>)[Getting started w/ React Native](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-rn>)[Getting started w/ Vanilla JS](https://www.instantdb.com/docs/<https:/instantdb.com/docs/start-vanilla>)[Init](https://www.instantdb.com/docs/<https:/instantdb.com/docs/init>)[Modeling data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/modeling-data>)[Writing data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaml>)[Reading data](https://www.instantdb.com/docs/<https:/instantdb.com/docs/instaql>)[Instant on the backend](https://www.instantdb.com/docs/<https:/instantdb.com/docs/backend>)[Patterns](https://www.instantdb.com/docs/<https:/instantdb.com/docs/patterns>)[Showcase](https://www.instantdb.com/docs/<https:/instantdb.com/docs/showcase>)[Auth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth>)[Magic codes](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/magic-codes>)[Google OAuth](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/google-oauth>)[Sign In with Apple](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/apple>)[Clerk](https://www.instantdb.com/docs/<https:/instantdb.com/docs/auth/clerk>)[Permissions](https://www.instantdb.com/docs/<https:/instantdb.com/docs/permissions>)[Managing users](https://www.instantdb.com/docs/<https:/instantdb.com/docs/users>)[Presence, Cursors, and Activity](https://www.instantdb.com/docs/<https:/instantdb.com/docs/presence-and-topics>)[Instant CLI](https://www.instantdb.com/docs/<https:/instantdb.com/docs/cli>)[Custom emails](https://www.instantdb.com/docs/<https:/instantdb.com/docs/emails>)[App teams](https://www.instantdb.com/docs/<https:/instantdb.com/docs/teams>)[Storage (beta)](https://www.instantdb.com/docs/<https:/instantdb.com/docs/storage>)
Previous
    [← Permissions](https://www.instantdb.com/docs/</docs/permissions>)
Next
    [Presence, Cursors, and Activity →](https://www.instantdb.com/docs/</docs/presence-and-topics>)
## On this page
  1. ### [See users in your app](https://www.instantdb.com/docs/</docs/users#see-users-in-your-app>)
  2. ### [Querying users](https://www.instantdb.com/docs/</docs/users#querying-users>)
  3. ### [Adding properties](https://www.instantdb.com/docs/</docs/users#adding-properties>)
    1. [Links](https://www.instantdb.com/docs/</docs/users#links>)
    2. [Attributes](https://www.instantdb.com/docs/</docs/users#attributes>)
  4. ### [User permissions](https://www.instantdb.com/docs/</docs/users#user-permissions>)




