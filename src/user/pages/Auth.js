import React, { useState } from 'react'

import '../../places/pages/NewPlace.css'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { useForm } from '../../shared/hoooks/form-hook'
import { VALIDATOR_EMAIL, VALIDATOR_MIN, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
export const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formState, inputHandler] = useForm({
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
        setIsLoginMode(prevMode => !prevMode);
    }
    const authSubmitHandler = event => {
        event.preventDefault();
    }
    return (
        <div className="place-form">
            <h2>Login</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode &&
                    <Input
                        id='user_name'
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