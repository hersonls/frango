import os
import subprocess
import atexit
import signal

from glob import glob

from django.conf import settings
from django.contrib.staticfiles.management.commands.runserver import Command\
    as StaticfilesRunserverCommand


class Command(StaticfilesRunserverCommand):
    frontend_dir = getattr(settings, 'FRONTEND_DIR', '')

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)
        self.taskrunner = self.get_taskrunner_command()

    def get_taskrunner_command(self):
        taskrunner = ''

        if glob(os.path.join(self.frontend_dir, 'gulpfile*js')):
            taskrunner = 'gulp'

        if glob(os.path.join(self.frontend_dir, 'Gruntfile*js')):
            taskrunner = 'grunt'

        return taskrunner

    def inner_run(self, *args, **options):
        self.start_grunt()
        return super(Command, self).inner_run(*args, **options)

    def start_grunt(self):
        self.stdout.write('>>> Starting {0} server:django task...'.format(
                          self.taskrunner))

        command = ['{0} serve:django --cwd {1}'.format(self.taskrunner,
                   self.frontend_dir)]

        self.grunt_process = subprocess.Popen(
            command,
            shell=True,
            stdin=subprocess.PIPE,
            stdout=self.stdout,
            stderr=self.stderr,
        )

        def kill_grunt_process(pid):
            self.stdout.write('>>> Closing {0} process'.format(
                              self.frontend_dir))

            os.kill(pid, signal.SIGTERM)

        atexit.register(kill_grunt_process, self.grunt_process.pid)
