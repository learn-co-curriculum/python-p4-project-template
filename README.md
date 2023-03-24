# Phase 4 Full-Stack Application Project Template

## Learning Goals

- Discuss the basic directory structure of a full-stack Flask/React application.
- Carry out the first steps in creating your Phase 4 project.

***

## Introduction

Fork and clone this lesson for a template for your full-stack application. Take
a look at the directory structure before we begin:

```console
$ tree -L 2
$ # the -L argument limits the depth at which we look into the directory structure
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── Pipfile.lock
├── README.md
├── client
│   ├── README.md
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
└── server
    ├── app.py
    ├── config.py
    ├── migrations
    ├── models.py
    └── seed.py
```

> **Note: You may already know some or all of the material covered in this
> lesson. We hope that having it all in one place will help you in designing
> and developing your project, regardless of where you're starting off.**

***

## Where Do I Start?

Just as with your Phase 3 Project, this will likely be one of the biggest
projects you've undertaken so far. Your first task should be creating a Git
repository to keep track of your work and roll back any undesired changes.

### Removing Existing Git Configuration

If you're using this template, start off by removing the existing metadata for
Github and Canvas. Run the following command to carry this out:

```console
$ rm -rf .git .canvas
```

The `rm` command removes files from your computer's memory. The `-r` flag tells
the console to remove _recursively_, which allows the command to remove
directories and the files within them. `-f` removes them permanently.

`.git` contains this directory's configuration to track changes and push to
Github (you want to track and push _your own_ changes instead), and `.canvas`
contains the metadata to create a Canvas page from your Git repo. You don't have
the permissions to edit our Canvas course, so it's not worth keeping around.

### Creating Your Own Git Repo

First things first- rename this directory! Once you have an idea for a name,
move one level up with `cd ..` and run `mv python-p4-project-template
<new-directory-name>` to change its name.

> **Note: `mv` actually stands for "move", but your computer interprets this
> rename as a move from a directory with the old name to a directory with
> a new name.**

`cd` back into your new directory and run `git init` to create a local git
repository. Add all of your local files to version control with `git add --all`,
then commit them with `git commit -m'initial commit`. (You can change the
message here- this one is just a common choice.)

Navigate to [GitHub](github.com). In the upper-right corner of the page, click
on the "+" dropdown menu, then select "New repository". Enter the name of your
local repo, choose whether you would like it to be public or private, make sure
"Initialize this repository with a README" is unchecked (you already have one),
then click "Create repository".

Head back to the command line and enter `git remote add <project name> <github
url>`. This will map the remote repository to your local repository. Finally,
push your first commit with `git push -u origin main`.

Your project is now version-controlled locally and online. This will allow you
to create different versions of your project and pick up your work on a
different machine if the need arises.

***

## Generating Your Pipenv

You might have noticed in the file structure- there's already a Pipfile! That
being said, we haven't put much in there- just Python version 3.8 and ipdb.

Install any dependencies you know you'll need for your project, like SQLAlchemy
and Alembic, before you begin. You can do this straight from the command line:

```console
$ pipenv install flask flask-sqlalchemy flask-migrate sqlalchemy-serializer flask-restful flask-cors
```

> _Sheesh!_

From here, you should run your second commit:

```console
$ git add Pipfile Pipfile.lock
$ git commit -m'add dependencies to pipenv'
$ git push
```

Now that your environment is set up, run `pipenv shell` to enter it.

***

## Generating Your Database

Once you're in your environment, you can start development wherever you'd like.
We think it's easiest to start with setting up your database.

`cd` into the `server/` directory, then run `flask db init migrations` to set up
Flask-Migrate.

Navigate to `models.py` and start creating your models. Remember
to regularly run `flask db revision --autogenerate -m'<descriptive message>'`
and `flask db upgrade head` to track your modifications to the database and
create checkpoints in case you ever need to roll those modifications back.

> **Tip: It's always a good idea to start with an empty revision! This allows
> you to roll all the way back while still holding onto your database. You can
> create this empty revision with `flask db revision -m'Create DB'`.**

If you want to seed your database, now would be a great time to write out your
`seed.py` script and run it to generate some test data. You may want to use
Pipenv to install Faker to save you some time.

***

## Generating Your Full-Stack Application

You've already made a few, but let's take a look at the structure of your
newest full-stack application.

### `client/`

The `client/` directory contains all of your frontend code. We've already used
`npm` to install your standard dependencies, including React. We've also
configured a proxy to the server for your backend at `localhost:5555` in
`package.json`. Feel free to change this to another port- just remember to
configure your Flask app to use another port as well!

### `server/`

The `server/` directory contains all of your backend code.

`app.py` is your Flask application. You'll want to use Flask to build a simple
API backend like we have in previous modules. You should use Flask-RESTful for
your routes.

You should be familiar with `models.py` and `seed.py` by now, but remember that
you will need to use Flask-SQLAlchemy, Flask-Migrate, and SQLAlchemy-Serializer
instead of SQLAlchemy and Alembic in your models. Don't forget to set an app
context in your seed file as well:

```py
with app.app_context():
    # seed here!

```

#### `config.py`

When developing a large Python application, you might run into a common issue:
_circular imports_. A circular import occurs when two modules import from one
another, such as `app.py` and `models.py`. When you create a circular import and
attempt to run your app, you'll see the following error:

```console
ImportError: cannot import name
```

If you're going to need an object in multiple modules like `app` or `db`,
creating a _third_ module to instantiate these objects can save you a great
deal of circular grief. Here's a good start to a Flask config file (you may
need more if you intend to include features like authentication and passwords):

```py
# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

```

Now let's review that last line...

#### CORS

CORS (Cross-Origin Reference Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed.
If you're using the fetch API to connect your frontend to your Flask backend,
you need to configure CORS on your Flask application instance. Lucky for us,
that only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

***

## Updating Your README.md

`README.md` is a Markdown file that describes your project. These files can be
used in many different ways- you may have noticed that we use them to generate
entire Canvas lessons- but they're most commonly used as homepages for online
Git repositories. **When you develop something that you want other people to
use, you need to have a README.**

Markdown is not a language that we cover in Flatiron's Software Engineering
curriculum, but it's not a particularly difficult language to learn (if you've
ever left a comment on Reddit, you might already know the basics). Refer to the
cheat sheet in this lesson's resources for a basic guide to Markdown.

### What Goes into a README?

This README should serve as a template for your own- go through the important
files in your project and describe what they do. Each file that you edit
(you can ignore your migration files) should get at least a paragraph. Each
function should get a small blurb.

You should descibe your application first, and with a good level of
detail. The rest should be ordered by importance to the user. (Probably
routes next, then models.)

Screenshots and links to resources that you used throughout are also useful to
users and collaborators, but a little more syntactically complicated. Only add
these in if you're feeling comfortable with Markdown.

***

## Conclusion

A lot of work goes into a full-stack application, but it all relies on concepts
that you've practiced thoroughly throughout this phase. Hopefully this template
and guide will get you off to a good start with your Phase 4 Project.

Happy coding!

***

## Resources

- [Setting up a respository - Atlassian](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Create a repo- GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Circular Imports - StackAbuse](https://stackabuse.com/python-circular-imports/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
