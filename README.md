# SunDev
SunDev is developed with the micro-framework Silex.

# Requirements
-  HTTP server handling php
-  [Composer](https://getcomposer.org/)

# Installation
- Clone this repository into a folder of your choice.
- Run `composer update` at the root of the SunDev folder.
- Install the following databases, included in repository (TODOOO):
    - dbc
    - suntools
    - world: your live world
    - test_world: your ptr world (can be the same as world)
- Create and edit `app/config.php` from `app/config.sample.php`
- Edit your host file so that `dev.sunstrider.com` points to your server. For example:   
        `127.0.0.1  dev.sunstrider.com`
- Create a virtual host in your web server config.
    Example of Apache config:

        <VirtualHost dev.sunstrider.com:80>
            DocumentRoot "D:/htdocs/SunDev/web"
            ServerName dev.sunstrider.com
        </VirtualHost>

# Usage
## Access
Just go into the address you put into your host file, such as `dev.sunstrider.com`  
The following admin user is already created in the database (user:password):
    - admin:admin

## Creating a user
    `/user/add`

# Development
* SmartAI:
  SmartAI Web Editor inspired by SmartAI Editor by Discover- using a custom jQuery library(smartai.js), [dataTables.js](http://www.datatables.net/), [chosen.js](http://harvesthq.github.io/chosen/) and [jQuery.xcolor.js](https://github.com/infusion/jQuery-xcolor).

* SunEquip:
  Equipment Web Editor.

* SunDungeon:
  Checklist of points to check for every NPCs in Outland Dungeons.

* SunWaypoints:
  Allow to transfer waypoints and set a pause to a point.

# Testing
* SunQuests:
  Checklist of points to check for every quests in Outland including zones, dungeons, raids and cities.

* SunClasses:
  Checklist of points to check for every classes including talents and spells.

# Roles
A role = a fonctionnality access.
They are listed in `app/app.php`.

# To Do
Implement:
* SunGossip: work in progress
* SunWorld
* Roles.md wiki