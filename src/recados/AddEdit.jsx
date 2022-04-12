import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { recadoService, alertService } from '../_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        autor: Yup.string()
            .required('Autor é obrigatório'),
        recado: Yup.string()
            .required('Recado é obrigatório'),
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createRecado(data)
            : updateRecado(id, data);
    }

    function createRecado(data) {
        data.data = new Date()
        return recadoService.create(data)
            .then(() => {
                alertService.success('Recado adicionado', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateRecado(id, data) {
        data.data = new Date()
        return recadoService.update(id, data)
            .then(() => {
                alertService.success('Recado atualizado', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    useEffect(() => {
        if (!isAddMode) {
            // get recado and set form fields
            recadoService.getById(id).then(recado => {
                const fields = ['autor', 'recado'];
                fields.forEach(field => setValue(field, recado[field]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Adicionar Recado' : 'Edit Recado'}</h1>
            <div className="form-row">
                <div className="form-group col">
                    <label>Autor</label>
                    <input name="autor" type="text" ref={register} className={`form-control ${errors.autor ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.autor?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Recado</label>
                    <input name="recado" type="text" ref={register} className={`form-control ${errors.recado ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.recado?.message}</div>
                </div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Salvar
                </button>
                <Link to={isAddMode ? '.' :  '..'} className="btn btn-link">Cancelar</Link>
            </div>
        </form>
    );
}

export { AddEdit };