import { Relationships } from '../../deps.ts';
import RoleModel from './role-model.ts';
import UserModel from './user-model.ts';

const UserRoleModel = Relationships.manyToMany(UserModel, RoleModel);

export default UserRoleModel;
