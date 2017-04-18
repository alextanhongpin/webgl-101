All the code for this chapter is in the **fps** folder. Resources are organized
into folders by file type:

- CSS is in the **css** folder
- Images are in the **images** folder
- 3D Collada models are in the **models** folder
- Ogg Vorbis sounds are in the **sounds** folder
- JavaScript code is in the **js** folder

Within the **js** folder, custom code for this chapter (e.g. that the reader
should be writing) is in the **src** directory. **player.js** and **bullet.js**
were written for Chapter 3, except that **player.js** has a small modification
to support team play. **main.js** similarly started out the same as in Chapter
3 but all the rest of the code for this chapter was then added there.

Library files for Three.js, PointerLock.js, and BigScreen are in the **lib**
directory inside the **js** folder. Inside the **lib** directory there is a
**vendor** folder which holds files distributed with the Three.js project but
not in the library itself.

Finally, **index.html** is the web page that holds the game. Attempting to open
it directly will cause errors; you must either host it on a web server or
change your browser's security settings as described at
https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally.

Please note that the code for this chapter introduces audio, which only works
in the Chrome browser.