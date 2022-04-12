import { Role } from './'

export function configureFakeBackend() {
    // array in local storage for recado records
    let recados = JSON.parse(localStorage.getItem('recados')) || [{ 
        id: 1,
        title: 'Mr',
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe@bloggs.com',
        role: Role.Recado,
        password: 'joe123'
    }];

    // monkey patch fetch to setup fake backend
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                const { method } = opts;
                switch (true) {
                    case url.endsWith('/recados') && method === 'GET':
                        return getRecados();
                    case url.match(/\/recados\/\d+$/) && method === 'GET':
                        return getRecadoById();
                    case url.endsWith('/recados') && method === 'POST':
                        return createRecado();
                    case url.match(/\/recados\/\d+$/) && method === 'PUT':
                        return updateRecado();
                    case url.match(/\/recados\/\d+$/) && method === 'DELETE':
                        return deleteRecado();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function getRecados() {
                return ok(recados);
            }

            function getRecadoById() {
                let recado = recados.find(x => x.id === idFromUrl());
                return ok(recado);
            }
    
            function createRecado() {
                const recado = body();

                if (recados.find(x => x.email === recado.email)) {
                    return error(`Recado with the email ${recado.email} already exists`);
                }

                // assign recado id and a few other properties then save
                recado.id = newRecadoId();
                recado.dateCreated = new Date().toISOString();
                delete recado.confirmPassword;
                recados.push(recado);
                localStorage.setItem('recados', JSON.stringify(recados));

                return ok();
            }
    
            function updateRecado() {
                let params = body();
                let recado = recados.find(x => x.id === idFromUrl());

                // only update password if included
                if (!params.password) {
                    delete params.password;
                }
                // don't save confirm password
                delete params.confirmPassword;

                // update and save recado
                Object.assign(recado, params);
                localStorage.setItem('recados', JSON.stringify(recados));

                return ok();
            }
    
            function deleteRecado() {
                recados = recados.filter(x => x.id !== idFromUrl());
                localStorage.setItem('recados', JSON.stringify(recados));

                return ok();
            }
    
            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return opts.body && JSON.parse(opts.body);    
            }

            function newRecadoId() {
                return recados.length ? Math.max(...recados.map(x => x.id)) + 1 : 1;
            }
        });
    }
}