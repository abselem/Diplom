# Generated by Django 4.1.7 on 2023-04-20 17:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0023_remove_paymentcompanytransfers_bill_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentcompanytransfers',
            name='bill_pay_num',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
    ]