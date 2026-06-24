🌸 Blossom Notes — Installation Guide for macOS
Welcome to Blossom Notes! Because this is a custom-built app made just for you, macOS will be a little overprotective when you try to open it the first time.

Follow these simple steps to download, install, and unlock the app on your Mac in under a minute!

📥 Step 1: Download & Install
Download the Blossom-Notes-Mac.zip file from the shared link.

Double-click the .zip file on your Mac to extract it. You will see a file named Blossom Notes-1.0.0-arm64.dmg (or the raw app icon).

Double-click the .dmg file and drag the Blossom Notes app icon directly into your Applications folder.

🛡️ Step 2: Fix the "App is Damaged" Warning
Because Apple doesn't recognize this as a commercial store app yet, it will likely show a scary popup saying: "Blossom Notes is damaged and can't be opened. You should move it to the Trash." Don't worry, the app isn't actually damaged! This is just a security quarantine flag. Here is how to clear it:

Press Cmd + Space on your keyboard, type Terminal, and press Enter.

Copy and paste this exact command into the Terminal window, but do not press Enter yet (make sure there is a space at the end!):

Bash
xattr -cr 
Open your Applications folder in Finder, find Blossom Notes, and drag and drop the icon directly into the Terminal window. The line should now look like this:

Bash
xattr -cr /Applications/Blossom\ Notes.app
Press Enter on your keyboard.

(Note: Terminal will not show a success message; it will just jump to a clean new line. That means it worked perfectly!)

🎉 Step 3: Open & Enjoy!
Go back to your Applications folder and double-click Blossom Notes. It will now open up beautifully, completely bypass the restriction, and be ready for you to write your notes! 🌸
