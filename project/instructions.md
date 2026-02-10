# Project

## Deadline

23 th of December 2025

## Opportunities

1. The DevOps project is based on all of the labs passed during the course, it is allowed to use them.

2. Work on the project can be carried out by 3 students. (keep the same group as the one for the labs)

3. You are allowed to collaborate with other students.

## Instructions

### 1. Create a web application

Create a web application on any programming language (NodeJS, Java, Ruby, Python, etc.), displaying simple content.

**Are proposed:**

- display your CV (or any other content)
- storage in Redis database (to count how many times your CV has been viewed but not necessary)
- tests: unit, API, configuration, connection. (Test your web application is displaying something)
- health check endpoint ensuring an application is functional

**Note!** You are allowed to use the draft application located in the [courses/devops/modules/03.continuous-testing/lab](courses/devops/modules/03.continuous-testing/lab) folder, but you have to enrich it by at least completing all comment sections marked "TODO".

### 2. Apply CI/CD pipeline 

Configure and apply CI/CD (including deployment) pipeline using any platforms (GitHub Actions, GitLab CI/CD, Jenkins, Netlify, Render, etc.).

**Note!** If the chosen deployment platform (like Render) requires a subscription to make use of their database service to connect to your app, you can skip using this service. In this case, your application won't be running properly, but it must successfully display the homepage. 

### 3. Configure and provision a virtual environment and run your application using the IaC approach

1. Configure with Vagrant: 1 VM running on any Linux distribution 
2. Provision the VM with Ansible, which includes installing and running:
  - language runtime
  - database
  - your application (use [sync folders](https://www.vagrantup.com/docs/synced-folders))
  - health check of your application

### 4. Build Docker image of your application

1. Create a Docker image of your application
2. Push the image to Docker Hub (put the link in your README.md)

**Note!** You must [ignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file) all the files and folders that do not need to be included in the image.

### 6. Make deployment using Kubernetes

1. Install Kubernetes cluster using Minikube
2. Create Kubernetes Manifest YAML files:
  - deployments
  - services
To be able to access your web application using a port on localhost.

### 5. Document your project 

Write a sort of report in the `README.md` file which includes the following:

1. List all the work performed (briefly, describing features and bonus tasks).

2. Screenshots (pictures of your screen when you are running a web page, K8s resources, VMs, etc... Provide maximum screenshots)

> Tip. Keep screenshots in a separate folder. Ex.: see how pictures are linked in the `index.md` files of the modules.

3. Provide instructions (commands) of how to:
  - Install (or prepare environment)
  - Use (your application, run your Docker container or Docker Compose cluster, on K8s cluster, ...)
  - Test (your application)
  
4. All the necessary links with the platforms and tools integrated:
  - Render
  - Docker Hub
  - ...
  
5. Author

6. Other additional info that you want to include...

> **Note!** Use the correct Markdown syntax to keep your `README.md` file looking good.
> **Note!** Each documentation issue that makes it difficult for the corrector to run the application at any step will result in a penalty.

## Structure

Here is an example structure of your project repository:

```
.github/
webapp/
  src/
  test/
  conf/
  CHANGELOG.md
  package.json
  Dockerfile
  ...
iac/
  Vagrantfile
  playbooks/
image/
README.md
...
```

## How to get bonuses?

Every initiative will be counted, just don't forget to describe it in your `README.md`.

List of bonus tasks proposed:

1. Use different tools and platforms instead of what has been passed in the labs if possible, for example, GitLab CI/CD, Netlify, etc. This will give you a bigger overview of technologies.
2. Use different languages (Java, Ruby, Python, etc.) to develop the application of part 1. (If you want to do more than a simple web application displaying simple content).
3. If you use the NodeJS application provided in the [modules/04.ct-ci-cd/assets/userapi](modules/04.ct-ci-cd/assets/userapi) folder, bring it with additional features:
  - more different API methods
  - more different unit/functional/integration tests
  - integrate a documenting package to your source code, for example, [Swagger UI](https://www.npmjs.com/package/express-swagger-generator)
4. Create a comment section on yout web application to let people comment.
5. Etc.

## How to send a project for evaluation?

1. **ATTENTION!** Make sure your repository is **PRIVATE** and **you have sent an invitation** to teacher's GitHub account. Otherwise, **if it isn't PRIVATE the final grade will be reduced to 0**.

2. After you have sent the invitation, send an email to your teacher containing the following:

  - **Subject format:** "<school_name> - DevOps project - \<LASTNAME Firstname\> - \<Group number (ex: SI03)\>"
  - **Message:**
    - **The link to the repository** on GitHub/GitLab
    - List of authors and **the group number**

## Grading system

| Subject                                                         |   Code    | Max. grade|
|:----------------------------------------------------------------|:---------:|:---------:|
| Application displaying simple content                           |   APP     |    +2     |
| Enriched web application with automated tests                   |   APP     |    +4     |
| Continuous Integration and Continuous Delivery (and Deployment) |   CICD    |    +3/3   |
| Infrastructure as code using Ansible                            |   IAC     |    +5     |
| Deployment with Kubernetes   	                                  |   KUB     |    +3     |
| Each bonus task                                                 |   BNS     |    +0,5   |
| Each penalty                                                    |   PNL     |    -2     |

It is also taken into account:

- richness of the commit history
- accuracy and purity of the project (descriptions, source code, files structure)
- activity during course sessions
