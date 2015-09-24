Frango - A FRontend and backend djANGO project template
=======================================================

Agora o Frontend e o Backend viverão em diretórios separados. Frango utiliza por
padrão Grunt para gerenciar suas tasks Frontend. Você poderá adaptar a mesma
ideia para outros projetos como por exemplo Gulp.

Entendendo a raiz do projeto:

```text
.
├── README.md
├── Makefile // Makefile executar para ações no projeto
├── frontend // Diretório frontend
└── backend // Diretório django
```

Dependencias
------------

Antes de tudo, as dependencias. Segue a lista de dependencias para rodar um
projeto Django/Frontend.

- NodeJS
- NPM
- Bower
- Grunt
- Libsass

### Instalação no Ubuntu:

É preciso definir no PATH do sistema o diretório binário local do nodejs.
Adicione no no arquivo ~/.bashrc a seguinte linha:

```
export PATH="$PATH:./node_modules/.bin" >> ~/.bashrc
```

Para instalar as dependencias:

```
sudo apt-get install nodejs nodejs-legacy npm
sudo npm install -g grunt-cli grunt bower
```

Configurando novo projeto Frango
--------------------------------

Para configurar um novo projeto com template Frango:

```
mkvirtualenv myproject
pip install django
django-admin startproject --template=https://github.com/hersonls/frango/archive/master.zip myproject
cd myproject
make config
```

Servidor de desenvolvimento
---------------------------

Frango acompanha um app com comandos para gerenciar os processos de servidor de
frontend e backend. Após a configuração, para utilizar o servidor de
desenvolvimento basta utilizar o comando:

```
$ python manage.py server
```

Frontend
--------

### Diretórios

```text
.
├── Gruntfile.js
├── bower.json
├── dist
├── node_modules
├── package.json
├── source
├── .tmp
└── test
```

- Diretório: `source`

Aqui você vai encontrar dois sub-diretórios, `static` e `templates`.

`static`: Contem todos os arquivos estáticos utilizado no frontend do projeto. Arquivos de apps do django, ainda serão mantidos nos diretórios do aplicativo. **Em desenvolvimento, o django deverá utilizar os estaticos a partir deste diretório.**

`templates`: Contem todos os templates do projeto. Todos os templates serão comprimidos quando for gerado uma build. **Em desenvolvimento, o django deverá utilizar os templates a partir deste diretório.**

```text
.
├── static
└── templates
```

- Diretório: `.tmp`

No diretório `.tmp` irá conter arquivos processados para uso temporário.

**Obs.: Este diretório é deverá ser servido como diretório estatico através do
django (STATICFILES_DIRS) em ambiente de desenvolvimento, em primiro
lugar na lista.**


- Diretório: `dist`

Será o diretorio onde o comando `grunt build` irá gerar e armazenar uma versão compilada e comprimida do fonte, todos os arquivos finais estaticos e de template do projeto. **Em desenvolvimento o Django deverá utilizar os templates a partir desse diretório.**


### Comandos

`grunt server`: Irá servir uma instancia do BrowserSync (que irá manter os navegadores sincronizados com as atualiações de código ) do projeto em localhost:9000, que será um proxy para o servidor django em localhost:8000.

**Obs.: Esse comando será utilizado por um comando customizado do Django `manage.py server`, que irá instanciar e gerenciar o processo automaticamente.**


`grunt build`: Irá compilar e comprimir uma versão do fonte no diretório `dist`.


Backend
-------

Um novo app foi adicionado ao projeto. O app frontend, irá disponibilizar comandos e configurações para genrenciar os arquivos de frontend.

O app deverá ser adicionado ao projeto e adicionado a lista INSTALED_APPS adequadamente.

### Configurações

Deverá ser adicionado ao settings.py as váriaveis para facilitar a configuração dos diretórios do projeto:

```
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.realpath(os.path.join(BASE_DIR, '..'))

# Frontend and backend paths
BACKEND_DIR = BASE_DIR
FRONTEND_DIR = os.path.join(ROOT_DIR, 'frontend')
```

Para a configuração dos diretórios de frontend a serem utilizados, deverá ter duas versões, uma para desenvolvimento e outra para produção:

- Em desenvolvimento:

```
#Templates
TEMPLATES = [
   {
       ...
       'DIRS': [
           os.path.join(FRONTEND_DIR, 'source', 'templates')
       ],
       ...
   }
]

# Static
STATICFILES_DIRS = [
  os.path.join(FRONTEND_DIR, '.tmp', 'static'),
  os.path.join(FRONTEND_DIR, 'source', 'static')
]
```

- Em produção:

```
# Templates
TEMPLATES = [
    {
        ...
        'DIRS': [
            os.path.join(FRONTEND_DIR, 'build', 'templates')
        ],
        ...
    }
]

# Static
STATICFILES_DIRS = [
    os.path.join(FRONTEND_DIR, 'build', 'static'),
]
```

### Comandos

`manage.py server`: Responsavel por rodar um servidor de desenvolvimento coberto por um proxy BrowserSync, que é configurado e gerenciado através do Grunt ( Gruntfile.js, localizado no diretório raiz frontend ).

O serviço BrowserSync por padrão irá rodar na porta 9000, redirecionando os requests para porta 8000.

O navegador padrão será inicializado automaticamente com o endereço do serviço.
