import React, { useState, useContext } from 'react'

import '../../places/pages/NewPlace.css'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hoooks/form-hook'
import { VALIDATOR_EMAIL, VALIDATOR_MIN, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
export const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
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
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode);
    }
    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            console.log('login mode')
        } else {
            try {
                const response = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })

                })


                const responseData = await response.json();
                console.log(responseData);

            } catch (err) {
                console.log(err)
            }
        }
        auth.login();
    }
    return (
        <div className="place-form">
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
                    type='text'
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
    )
}

export default Auth