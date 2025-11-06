import { AddressEntity } from '../models/address.model';
import { AddressModel } from '../types/address';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/apiError';
import { add } from 'winston';

interface addressEntry extends AddressModel {
  gsi1pk?: string;
  gsi1sk?: string;
}

const saveAddress = async (addressData: addressEntry) => {
  const { userId } = addressData;

  const addressId = uuidv4();
  addressData.addressId = addressId;
  addressData.gsi1pk = userId;
  addressData.gsi1sk = new Date().toISOString();

  const newAddress = await AddressEntity.put(addressData).go();

  return newAddress;
};

const getAddressByUser = async (userId: string) => {
  const addresses = await AddressEntity.query.addressById({ gsi1pk: userId }).go();
  return addresses.data;
};

const getAddressById = async (addressId: string) => {
  const address = await AddressEntity.get({ addressId }).go();
  if (!address.data) {
    throw new ApiError('Address not found with id: ' + addressId, 400);
  }
  return address.data;
};

const updateAddressById = async (addressId: string, addressData: Partial<AddressModel>) => {
  //   const existingAddress = await AddressEntity.get({ addressId }).go();
  const updatedAddress = await AddressEntity.update({ addressId })
    .set(addressData)
    // .where((attr, op) => op.eq(attr.addressId, addressId))
    .go();
  return updatedAddress;
};

const deleteAddressById = async (addressId: string, userId?: string) => {
  if (!userId) {
    throw new ApiError('Login is required to delete address', 400);
  }

  const existingAddress = await AddressEntity.get({ addressId }).go();
  if (!existingAddress.data) {
    throw new ApiError('Address not found with id: ' + addressId, 400);
  }

  const deletedAddress = await AddressEntity.delete({ addressId }).go();

  return deletedAddress;
};

export { saveAddress, getAddressByUser, getAddressById, updateAddressById, deleteAddressById };
