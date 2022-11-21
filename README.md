# ComicViewer

## Things used
- Firebase Real-time database (get urls of the images from Google Drive)
- Google Drive (host images)
- Node.js (to deploy your website to Firebase hosting. Not necessary if you want to host elsewhere)
## DISCLAIMER
- Using Firebase, you are limited enought to make request to their services, so expect exception in console about billing require
- Google Drive, if you use this cloud to host your images, it will block you if you test too much and make too many request to them. A 403 error you will get from it in such case

## Info
Layout of getting images in a manner of comic pages. 

Have responsive behavoir for desktop and mobile.

All javascript functionality is based on modules.

This composition can be integrated to your pages if you make some changes in layout.
<details>
<summary>Css configuration</summary>

To change the size of comic view, in the css file [./comicViewPage.css](./comicViewPage.css)

```css
/*MAIN CONTAINER OF THIS COMIC VIEW. THIS MUST BE MODIFIED IN ORDER TO FIT IN ANY PAGES AS NEEDED*/
#container {
    margin: auto;
    height: 100vh;
    width: 100%;
    position: relative;
}
/*MAIN CONTAINER OF THIS COMIC VIEW. THIS MUST BE MODIFIED IN ORDER TO FIT IN ANY PAGES AS NEEDED*/
```

You have this html element styling to change for your needs, and the rest, I suppose, will work as it should without reconfiguring the viewport dimensions or something else.

</details>

<details>
<summary>If you want Firebase real-time database too. Gathering links</summary>

## Firebase connection
In the js file [./modules/imgURLFetcher.js](./modules/imgURLFetcher.js)

```javascript
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  storageBucket: ''

};
```

You have to bring your credentials from Firebase. Search on youtube about how you can get firebase api key for web client or

see this [YT video](https://youtu.be/IudOiOwppFA?t=100)

## Url collection

In the js file [./modules/imgURLFetcher.js](./modules/imgURLFetcher.js)

```javascript
export function fetch(callFunctionAfterFetch) {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const starCountRef = ref(db, '/some_node/some_node');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    callFunctionAfterFetch(data.URL.split(","));
  });
}
```
On the server side, my structure was:

<pre>
/some_node/some_node
/Comics   /chosen_comic
</pre>

- *Comics* is my main node where I store all comics
- *comic_chose* is the second node representing chosen comic
- *const data = snapshot.val();* where data is the JSON object from Firestorm Real-time database
- *data.URL* where URL is a property of data JSON object representing a string with all links of the chosen comic, comma separated (link1,link2,link3,...).

The important thing here is the function **fetch()** which use **data** variable (in my case the property URL from data JSONobject stored the links) to store and send further an array with the links of the images/comic pages to the [./modules/imgURLHandler.js](./modules/imgURLHandler.js) using a callback function , which in the [./comicViewPage.js](./comicViewPage.js) is **init(data)** function to handle all functionality of showing images.

For short you have to supply to the callback function an array representing the links of your images, using what server you want.

</details>

Chose other id attribute for the html elements to prevent errors and undesired behavoir.

Replace any images you want to [./img](./img). I do not like them, but I forgot them.

## How this look
WARNING NSFW content!

The M-bot will smash you with log in prompt PUNCH [Newgrounds](https://www.newgrounds.com/portal/view/862755?updated=1667856511).

No bot to smash you with log in prompt PUNCH but this can be removed either me or other bad persons [Firebase hosting]( https://comics-viewer-c433d.web.app?comic=SexceptionOccurred ).

Would not be the end of the world if you mentionate me when you use this composition.

## Page navigation

### Mouse

- Left click on the left and right elements to change current image.
- Move the mouse up and down to see all the image.

### Keyboard

- **Key a** or **numpad key 4** to get previous image.
- **Key d** or **numpad key 6** to get next image.
- **Key w** or **numpad key 8** and **Key s** or **numpad key 2** have same behavoir with mouse moving to see all the image, instead of scrolling.

*I don't know if you are left or right handed* so I had to make more accessebility for both cases :)*

The keyboard navigation feature is for some,... very fast people who have too much hand tremors.

Only for desktop devices, for mobile devices scrolling instead.

### Changing current reached page (Value from the left side of slash "/" of the top of the webpage)
If you know what page you reach, you can type the number of that page.

Either press Enter or click somewhere to load another image.

On mobile, only when you tap somewhere in the webpage , the image will load, otherwise will not.

P.S. Not a good NSFW artist, not a good programmer, but a very good meat beater

## Tested on
- Brave Android (Pass)
- Firefox Desktop (Pass)
- Chrome Desktop (~~Failed~~Pass)
- Duck Duck Go Android(~~Failed~~Pass)


## Docs used
- [Real-time database Firebase]( https://firebase.google.com/docs/database/web/start )
