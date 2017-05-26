import os
import subprocess
import atexit
import signal

from django.conf import settings
from django.contrib.staticfiles.management.commands.runserver import Command\
    as StaticfilesRunserverCommand


class Command(StaticfilesRunserverCommand):

    def inner_run(self, *args, **options):
        self.start_grunt()
        return super(Command, self).inner_run(*args, **options)

    def start_grunt(self):
        self.stdout.write('>>> Starting gulp server:django task...')

        self.grunt_process = subprocess.Popen(
            ['gulp serve:django --cwd {0}'
             .format(settings.FRONTEND_DIR)],
            shell=True,
            stdin=subprocess.PIPE,
            stdout=self.stdout,
            stderr=self.stderr,
        )

        self.stdout.write('>>> Gulp process on pid {0}'
                          .format(self.grunt_process.pid))

        def kill_grunt_process(pid):
            self.stdout.write('>>> Closing gulp process')
            os.kill(pid, signal.SIGTERM)

        atexit.register(kill_grunt_process, self.grunt_process.pid)
