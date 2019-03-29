import React from 'react';
import PatPropInput from './PatPropInput';
import PatPropRadioset from './PatPropRadioset';
import toEditableDate from './toEditableDate';
import SubmitButton from '../common/SubmitButton';

export default function PatPropsForm({
  patData,
  handlerChange,
  errors,
  allow,
  messages,
  handlerSumbit,
  handlerDelete,
}) {
  const radioset = [{ label: 'жен.', value: 'female' }, { label: 'муж.', value: 'male' }];

  return (
    <form name="patPropsForm" onSubmit={handlerSumbit}>
      <p className="tb">
        <PatPropInput
          label="Фамилия"
          name="familyName"
          value={patData.familyName}
          handler={handlerChange}
          errors={errors}
        />
        &nbsp;
        <PatPropInput
          label="Имя"
          name="firstName"
          value={patData.firstName}
          handler={handlerChange}
          errors={errors}
        />
        &nbsp;
        <PatPropInput
          label="Отчество"
          name="fathersName"
          value={patData.fathersName}
          handler={handlerChange}
          errors={errors}
        />
        <br />
        <PatPropInput
          label="Дата рождения"
          name="dateOfBirth"
          value={toEditableDate(patData.dateOfBirth)}
          size="10"
          handler={handlerChange}
          errors={errors}
        />
        <PatPropRadioset
          list={radioset}
          label="Пол (официальный)"
          name="officialSex"
          value={patData.officialSex}
          handler={handlerChange}
        />
        <br />
        <PatPropInput
          label="Биологический пол"
          name="biologicalSex"
          value={patData.biologicalSex}
          handler={handlerChange}
          errors={errors}
        />
        <br />
        <PatPropInput
          label="Адрес"
          name="address"
          value={patData.address}
          size="50"
          handler={handlerChange}
          errors={errors}
        />
        &nbsp;
        <PatPropInput
          label="Телефон"
          name="phoneNumber"
          value={patData.phoneNumber}
          handler={handlerChange}
          errors={errors}
        />
        <br />
        <PatPropInput
          label="Причина изменений"
          name="updateReason"
          size="60"
          handler={handlerChange}
          errors={errors}
        />
        <br />
        <PatPropInput
          label="Дата изменения (юридически)"
          name="updateDateDeJure"
          size="10"
          handler={handlerChange}
          errors={errors}
        />
        <br />
        <SubmitButton text="Send" allow={allow} />
        <button
          name="delete"
          style={{ backgroundColor: '#ffb3b3', float: 'right' }}
          onClick={handlerDelete}
        >
          DELETE PATIENT
        </button>
      </p>
      {messages.map(m => (
        <p className="tb" style={{ color: m.color }} key={m.id}>
          {m.text}
        </p>
      ))}
    </form>
  );
}
