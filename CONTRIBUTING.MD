# Contributing Guidelines

## Opening an issue:

Thank you for taking the time to open an issue.
<br>
Before opening an issue, please be sure that your issue hasn't already been asked by someone.
<br><br>
Here are a few things that will help us resolve your issues:

- A descriptive title that gives an idea of what your issue refers to
- A thorough description of the issue, (one word descriptions are very hard to understand)
- Screenshots (if appropriate)
- Links (if appropriate)
  <br><br>

## Submitting a pull request:

Follow the below mentioned steps to open a pull request(PR):

#### If you don't have git on your machine, [install it](https://help.github.com/articles/set-up-git/).

## Fork this repository

Fork this repository by clicking on the fork button at the top of this page.
This will create a copy of this repository in your account.

## Clone the repository

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the _copy to clipboard_ icon.

Open a terminal and run the following git command:

```
git clone "url you just copied"
```

where "url you just copied" (without the quotation marks) is the url to this repository (your fork of this project). See the previous steps to obtain the url.

For example:

```
git clone https://github.com/this-is-you/reduced.to.git
```

where `this-is-you` is your GitHub username. Here you're copying the contents of the first-contributions repository on GitHub to your computer.

## Create a branch

Change to the repository directory on your computer (if you are not already there):

```
cd reduced.to
```

Now create a branch using the `git switch` command:

```
git switch -c your-new-branch-name
```

For example:

```
git switch -c improved-ui
```

## Make necessary changes and commit those changes

If you go to the project directory and execute the command `git status`, you'll see there are changes.

Add those changes to the branch you just created using the `git add` command:

```
git add "filename with extension in which you have made changes"
```

Now commit those changes using the `git commit` command:

```
git commit -m "Add relevant message to the change you made"
```

## Push changes to GitHub

Push your changes using the command `git push`:

```
git push origin -u your-branch-name
```

replacing `your-branch-name` with the name of the branch you created earlier.

## Submit your changes for review

If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.

Now submit the pull request.

Soon a reviewer will be merging all your changes into the main branch of this project. You will get a notification email once the changes have been merged.

## Note:

PRs that exclusively add items to the list of domains will be classed as spam/invalid. We already grab this list from ICANN's complete list of certified registrars.  
