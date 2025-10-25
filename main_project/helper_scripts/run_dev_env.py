import subprocess

backend_path = r"%ipt_back%"
frontend_path = r"%ipt_front%"

cmd = (
    f'wt new-tab --title "Backend" cmd /k "cd {backend_path} && python manage.py runserver" ; '
    f'new-tab --title "Frontend" cmd /k "cd {frontend_path} && npm start" ; '
    f'new-tab --title "Parent Dir" cmd /k "cd {backend_path} && cd .."'
)

subprocess.run(cmd, shell=True)
