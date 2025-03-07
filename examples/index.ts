import { select, Separator } from '@inquirer/prompts';
import { input } from '@inquirer/prompts';
import { WriteParallel } from './writefile-parallel';
import { WriteLog } from './log-from-several-files';

(async ()=>
{
    console.clear();

    const answer = await select(
    {
        message: 'What example do you want to run',
        choices: [
          {
            name: 'files in parallel',
            value: 'writefile-parallel',
            description: '\nWrite several files in parallel',
          },
          {
            name: 'log-from-files',
            value: 'log-from-several-files',
            description: '\nCreate a log from several files\nRead content of several files and apend to a single log file',
          },
        //   new Separator(),
        //   {
        //     name: 'jspm',
        //     value: 'jspm',
        //     disabled: true,
        //   },
        //   {
        //     name: 'pnpm',
        //     value: 'pnpm',
        //     disabled: '(pnpm is not available)',
        //   },
        ],
    });

    console.log(answer)


    switch (answer)
    {
        case "writefile-parallel":
            WriteParallel();
            break;

        case "log-from-several-files":
            WriteLog()
            break;
    }
}
)();