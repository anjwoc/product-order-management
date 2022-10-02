import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'Order' })
export class Order extends CommonEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverName: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverPhone: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverAddress: string;

  @ManyToOne(() => User, (users) => users.orders)
  user: User;
}
