import { Length, Contains, IsInt, Min, Max, IsEmail, IsFQDN, IsDate, IsNotEmpty } from 'class-validator';
import { BaseDecorator } from './BaseDecorator';

export class TestDecorator extends BaseDecorator {
  @Length(10, 20, { message: '标题长度应为10 - 20位' })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @Contains('hello', { message: 'text内容不符合要求，必须包含hello字段' })
  @IsNotEmpty({ message: 'text不能为空' })
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsEmail()
  email: string;

  @IsFQDN()
  site: string;

  @IsDate()
  createDate: Date;
}

const test = async () => {
  const obj = new TestDecorator();

  obj.title = '1234567890';

  const result = await obj._validate();

  console.log('result', result);
};

test();
