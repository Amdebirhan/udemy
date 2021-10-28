import React, { useState, useContext } from 'react'

import '../../places/pages/NewPlace.css'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hoooks/form-hook'
import { useHttpClient } from '../../shared/hoooks/http-hook'
import { VALIDATOR_EMAIL, VALIDATOR_MIN, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

export const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoding, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false,
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode);
    }
    const authSubmitHandler = async event => {
        event.preventDefault();


        if (isLoginMode) {

            try {
                const responseData = await sendRequest('http://localhost:5000/api/users/login', 'POST', JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }), {
                    'Content-Type': 'application/json'
                },
                );
                auth.login(responseData.user.id);
            } catch (err) {

            }




        } else {
            try {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest('http://localhost:5000/api/users/signup', 'POST',
                    formData, {
                    'Content-Type': 'application/json',
                })
                auth.login(responseData.user.id);
            } catch (err) { }

        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="place-form">
                {isLoding && <LoadingSpinner asOverlay />}
                <h2>{isLoginMode ? 'Login' : 'Sign up'}</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode &&
                        <Input
                            id='name'
                            element='input'
                            type='text'
                            label='Name'
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText='please enter a name'
                            onInput={inputHandler}
                        />
                    }
                    {!isLoginMode &&
                        <ImageUpload center id='image' onInput={inputHandler} errorText='please provide an image.' />
                    }
                    <Input
                        id='email'
                        element='input'
                        type='text'
                        label='Email'
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                        errorText='please enter a valid email'
                        onInput={inputHandler}
                    />
                    <Input
                        id='password'
                        element='input'
                        type='password'
                        label='password'
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                        errorText='please enter a valid password'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'Login' : 'Sign up'}</Button>
                </form>
                <br />
                <Button inverse onClick={switchModeHandler}>{isLoginMode ? 'Sign up' : 'Login'}</Button>
            </div>
        </React.Fragment>
    )
}

export default Auth