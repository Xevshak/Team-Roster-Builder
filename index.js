const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const DIST_DIR = path.resolve(__dirname, 'dist');
const distPath = path.join(DIST_DIR, 'team.html');

const render = require('./src/page-template.js');

const teamMembers = [];
const idArray = [];

// Inform user of usage
console.log(
  '\nWelcome to the team generator!\nUse `npm run reset` to reset the dist/ folder\n'
);

function appMenu() {
  function createManager() {
    console.log("It's time to select your roster!");
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'managerName',
          message: "Manager's name?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter something';
          },
        },
        {
          type: 'input',
          name: 'managerId',
          message: "Manager ID?",
          validate: (answer) => {
            const pass = answer.match(/^[0-9]\d*$/);
            if (pass) {
              return true;
            }
            return 'Please enter a positive number or zero.';
          },
        },
        {
          type: 'input',
          name: 'managerEmail',
          message: "Managr email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return 'Enter a valid email address please';
          },
        },
        {
          type: 'input',
          name: 'managerOfficeNumber',
          message: "Manager's office number?",
          validate: (answer) => {
            const pass = answer.match(/^[0-9]\d*$/);
            if (pass) {
              return true;
            }
            return 'Please enter a positive number or zero.';
          },
        },
      ])
      .then((answers) => {
        const manager = new Manager(
          answers.managerName,
          answers.managerId,
          answers.managerEmail,
          answers.managerOfficeNumber
        );
        teamMembers.push(manager);
        idArray.push(answers.managerId);
        createTeam();
      });
  }

  function createTeam() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'memberChoice',
          message: 'Who else is on the roster?',
          choices: [
            'Engineer',
            'Intern',
            "I don't want to add any more team members",
          ],
        },
      ])
      .then((userChoice) => {
        switch (userChoice.memberChoice) {
          case 'Engineer':
            addEngineer();
            break;
          case 'Intern':
            addIntern();
            break;
          default:
            buildTeam();
        }
      });
  }

  function addEngineer() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'engineerName',
          message: "Engineer's name?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please write something';
          },
        },
        {
          type: 'input',
          name: 'engineerId',
          message: "What is your engineer's id?",
          validate: (answer) => {
            const pass = answer.match(/^[109]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return 'IDs are unique, make sure this one is different from everyone else.';
              } else {
                return true;
              }
            }
            return 'Please enter a positive number or zero.';
          },
        },
        {
          type: 'input',
          name: 'engineerEmail',
          message: "Engineer email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return 'Please enter an email address with an @ and a .';
          },
        },
        {
          type: 'input',
          name: 'engineerGithub',
          message: "Engineer GitHub username?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please write something.';
          },
        },
      ])
      .then((answers) => {
        const engineer = new Engineer(
          answers.engineerName,
          answers.engineerId,
          answers.engineerEmail,
          answers.engineerGithub
        );
        teamMembers.push(engineer);
        idArray.push(answers.engineerId);
        createTeam();
      });
  }

  function addIntern() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'internName',
          message: "Intern name?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please write something';
          },
        },
        {
          type: 'input',
          name: 'internId',
          message: "Intern's ID?",
          validate: (answer) => {
            const pass = answer.match(/^[0-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return 'IDs are unique, make sure this one is different from everyone else.';
              } else {
                return true;
              }
            }
            return 'Please enter a positive number or zero.';
          },
        },
        {
          type: 'input',
          name: 'internEmail',
          message: "Intern's email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return 'Please enter an email address with an @ and a .';
          },
        },
        {
          type: 'input',
          name: 'internSchool',
          message: "Intern's school?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please write something';
          },
        },
      ])
      .then((answers) => {
        const intern = new Intern(
          answers.internName,
          answers.internId,
          answers.internEmail,
          answers.internSchool
        );
        teamMembers.push(intern);
        idArray.push(answers.internId);
        createTeam();
      });
  }

  function buildTeam() {
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR);
    }
    fs.writeFileSync(distPath, render(teamMembers), 'utf-8');
  }

  createManager();
}

appMenu();
