# Generated by Django 4.1.7 on 2023-04-20 17:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0019_remove_credit_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentcompanytransfers',
            name='Company',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='bank_info.paymentcompany'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='credit',
            name='sum_pog',
            field=models.DecimalField(blank=True, decimal_places=1, default=0, max_digits=10, null=True),
        ),
    ]
