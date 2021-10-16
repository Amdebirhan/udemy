import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hoooks/form-hook';
import './NewPlace.css';
import Card from '../../shared/components/UIElements/Card';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];

export const UpdatePlace = () => {


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

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    useEffect(() => {
        if (identifiedPlace) {

            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: identifiedPlace.description,
                    isValid: true
                }
            }, true)
        }
    }, [setFormData, identifiedPlace])


    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
    }

    if (!identifiedPlace) {
        return (
            <div className='center'>
                <Card>
                    <h2>could not find the place</h2>
                </Card>
            </div>
        )
    }

    if (!formState.inputs.title.value) {
        return (
            <div className='center'>
                <h2>loading...</h2>
            </div>
        )
    }

    return (
        formState.inputs.title.value && (<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input
                id='title'
                element='input'
                type='text'
                lable='title'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='please enter a valid text'
                onInput={inputHandler}
                value={formState.inputs.title.value}
                valid={formState.inputs.title.isValid}
            />
            <Input
                id='description'
                element='textarea'
                lable='Description'
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText='please enter a valid DESCRIPTION'
                onInput={inputHandler}
                value={formState.inputs.description.value}
                valid={formState.inputs.description.isValid}
            />
            <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE </Button>
        </form>)
    )
}
