import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hoooks/form-hook';
import './NewPlace.css';
import Card from '../../shared/components/UIElements/Card';
import { useHttpClient } from '../../shared/hoooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

export const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [loadedPlace, setLoadedPlace] = useState()
    const { isLoding, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)

    const placeId = useParams().placeId;


    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
                setLoadedPlace(responseData.places);
                setFormData({
                    title: {
                        value: responseData.places.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.places.description,
                        isValid: true
                    }
                }, true);
                console.log(formState.inputs)

            } catch (err) { }
        }
        fetchPlace();
    }, [sendRequest, placeId, setFormData])


    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
            }), {
                'Content-Type': 'application/json',
            })
            history.push('/' + auth.userId + '/places');
        } catch (err) { }
    }
    if (isLoding) {
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (!loadedPlace && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>could not find the place</h2>
                </Card>
            </div>
        )
    }



    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoding && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='please enter a valid text'
                    onInput={inputHandler}
                    value={loadedPlace.title}
                    valid={true}
                />
                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='please enter a valid DESCRIPTION'
                    onInput={inputHandler}
                    value={loadedPlace.description}
                    valid={true}
                />
                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE </Button>
            </form>}
        </React.Fragment>
    )
}
